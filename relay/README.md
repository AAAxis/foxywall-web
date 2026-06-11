# FoxyWall residential relay agent

Turns a VPS into the **portal** side of the Xray reverse proxy: customer SOCKS
traffic → portal → device bridge → exits via the device's home IP.

The agent polls Supabase `list_gateway_devices(gateway_id, agent_token)` and renders
`/usr/local/etc/xray/config.json` from the assigned devices, then restarts xray. It
preserves the consumer VPN `http-proxy` inbound (port 1080) and validates every
render with `xray -test` before swapping.

## Layout on the box
- `/opt/foxywall-relay/agent.py` — the agent
- `/etc/foxywall-relay.env` — config (Supabase + gateway id/token + 1080 creds)
- `/etc/systemd/system/foxywall-relay.service` — runs the agent as root

## Deploy
```bash
scp -i KEY relay/agent.py azureuser@HOST:/tmp/agent.py
ssh -i KEY azureuser@HOST 'sudo mkdir -p /opt/foxywall-relay && sudo mv /tmp/agent.py /opt/foxywall-relay/'
# write /etc/foxywall-relay.env (see foxywall-relay.env.example) and the unit, then:
ssh -i KEY azureuser@HOST 'sudo systemctl daemon-reload && sudo systemctl enable --now foxywall-relay'
```

## How a device becomes usable
1. App registers → `register_exit_node` → `assign_gateway` allocates uuid / SOCKS
   port / sentinel / creds onto the `fleet_devices` row.
2. Agent (≤30s later) regenerates the portal config and restarts xray.
3. Device runs its bridge (while charging) and dials `gateway:443` with its uuid.
4. Customer connects `socks5://socks_user:socks_pass@gateway:socks_port` and exits
   via that device's home IP.

`exit_enabled=false` on a device row drops it from the next render.
