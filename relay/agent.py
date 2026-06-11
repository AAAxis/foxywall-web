#!/usr/bin/env python3
"""
FoxyWall residential-proxy relay agent.

Polls Supabase (list_gateway_devices) for the devices assigned to this gateway and
renders the Xray *portal* config — generalising the hand-built single-device template
to N devices. For each assigned device it emits:
  - a VLESS client on the shared `interconnect` inbound (the device dials in),
  - a `reverse.portals` entry keyed by the device's sentinel,
  - a per-device SOCKS inbound on its socks_port (customer-facing creds),
  - routing: interconnect+sentinel -> portal, and socks-N -> portal.

The consumer VPN's `http-proxy` inbound (port 1080) is preserved verbatim so this
agent never takes it down. Before swapping config it runs `xray -test`; it only
writes + restarts xray when the rendered config actually changed and validates.

Config via env (see foxywall-relay.env):
  SUPABASE_URL, SUPABASE_ANON_KEY, GATEWAY_ID, AGENT_TOKEN,
  XRAY_CONFIG (default /usr/local/etc/xray/config.json),
  XRAY_BIN (default /usr/local/bin/xray),
  XRAY_SERVICE (default xray),
  HTTP_PROXY_PORT/USER/PASS (the preserved consumer 1080 proxy),
  POLL_SECONDS (default 30).
"""
import json
import os
import subprocess
import sys
import time
import urllib.request

SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
ANON_KEY = os.environ["SUPABASE_ANON_KEY"]
GATEWAY_ID = os.environ["GATEWAY_ID"]
AGENT_TOKEN = os.environ["AGENT_TOKEN"]
XRAY_CONFIG = os.environ.get("XRAY_CONFIG", "/usr/local/etc/xray/config.json")
XRAY_BIN = os.environ.get("XRAY_BIN", "/usr/local/bin/xray")
XRAY_SERVICE = os.environ.get("XRAY_SERVICE", "xray")
HTTP_PROXY_PORT = int(os.environ.get("HTTP_PROXY_PORT", "1080"))
HTTP_PROXY_USER = os.environ.get("HTTP_PROXY_USER", "foxy")
HTTP_PROXY_PASS = os.environ.get("HTTP_PROXY_PASS", "")
POLL_SECONDS = int(os.environ.get("POLL_SECONDS", "30"))


def fetch_devices():
    """Call list_gateway_devices; return (interconnect_port, [device,...])."""
    body = json.dumps({"p_gateway_id": GATEWAY_ID, "p_agent_token": AGENT_TOKEN}).encode()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/rpc/list_gateway_devices",
        data=body,
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        out = json.loads(resp.read().decode())
    if not out.get("success"):
        raise RuntimeError(f"list_gateway_devices: {out.get('error')}")
    return int(out["gateway"]["port"]), out["devices"]


def render(interconnect_port, devices):
    active = [d for d in devices if d.get("enabled", True)
              and d.get("uuid") and d.get("sentinel") and d.get("socks_port")]

    interconnect = {
        "tag": "interconnect",
        "listen": "0.0.0.0",
        "port": interconnect_port,
        "protocol": "vless",
        "settings": {
            "clients": [{"id": d["uuid"], "email": d["device_id"]} for d in active],
            "decryption": "none",
        },
        "streamSettings": {"network": "tcp", "security": "none"},
    }
    http_proxy = {
        "tag": "http-proxy",
        "listen": "0.0.0.0",
        "port": HTTP_PROXY_PORT,
        "protocol": "http",
        "settings": {
            "accounts": [{"user": HTTP_PROXY_USER, "pass": HTTP_PROXY_PASS}],
            "allowTransparent": False,
        },
    }

    inbounds = [interconnect, http_proxy]
    portals = []
    rules = []
    for d in active:
        did = d["device_id"]
        stag, ptag = f"socks-{did}", f"portal-{did}"
        inbounds.append({
            "tag": stag,
            "listen": "0.0.0.0",
            "port": int(d["socks_port"]),
            "protocol": "socks",
            "settings": {
                "auth": "password",
                "udp": True,
                "accounts": [{"user": d["socks_user"], "pass": d["socks_pass"]}],
            },
        })
        portals.append({"tag": ptag, "domain": d["sentinel"]})
        rules.append({"type": "field", "inboundTag": ["interconnect"],
                      "domain": [f"full:{d['sentinel']}"], "outboundTag": ptag})
        rules.append({"type": "field", "inboundTag": [stag], "outboundTag": ptag})
    rules.append({"type": "field", "inboundTag": ["http-proxy"], "outboundTag": "direct"})

    return {
        "log": {"loglevel": "warning"},
        "inbounds": inbounds,
        "reverse": {"portals": portals},
        "outbounds": [{"tag": "direct", "protocol": "freedom"}],
        "routing": {"rules": rules},
    }


def current_config():
    try:
        with open(XRAY_CONFIG) as f:
            return json.load(f)
    except Exception:
        return None


def apply(cfg):
    """Validate then swap + restart xray. Returns True if applied."""
    # Xray infers config format from the file extension, so the temp MUST end in
    # .json (a `.json.new` name fails with "Failed to get format").
    tmp = os.path.join(os.path.dirname(XRAY_CONFIG) or ".", ".relay-render.json")
    with open(tmp, "w") as f:
        json.dump(cfg, f, indent=2)
    test = subprocess.run([XRAY_BIN, "run", "-test", "-config", tmp],
                          capture_output=True, text=True)
    if test.returncode != 0:
        sys.stderr.write(f"[relay] rendered config failed xray -test, NOT applying:\n{test.stderr}\n")
        os.remove(tmp)
        return False
    os.replace(tmp, XRAY_CONFIG)
    subprocess.run(["systemctl", "restart", XRAY_SERVICE], check=True)
    return True


def main():
    sys.stdout.write(f"[relay] agent up: gateway={GATEWAY_ID} poll={POLL_SECONDS}s\n")
    sys.stdout.flush()
    while True:
        try:
            port, devices = fetch_devices()
            desired = render(port, devices)
            if desired != current_config():
                if apply(desired):
                    n = sum(1 for d in devices if d.get("enabled", True))
                    sys.stdout.write(f"[relay] applied: {n} device(s) active\n")
                    sys.stdout.flush()
        except Exception as e:
            sys.stderr.write(f"[relay] poll error: {e}\n")
            sys.stderr.flush()
        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    main()
