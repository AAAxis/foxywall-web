import { getSupabaseAdmin } from "./supabase-admin"

export type DeviceType = "ios" | "android" | "windows" | "macos" | "linux" | "other"

export type FleetDevice = {
  id: string
  company_id: string
  account_id: string | null
  device_id: string
  device_name: string | null
  device_type: DeviceType
  mac_address: string | null
  app_version: string | null
  public_ip: string | null
  vpn_state: "on" | "off" | null
  last_trigger: string | null
  rx_bytes: number | null
  tx_bytes: number | null
  speed_down_bps: number | null
  speed_up_bps: number | null
  gateway_host: string | null
  socks_port: number | null
  socks_user: string | null
  socks_pass: string | null
  exit_enabled: boolean | null
  enrolled_at: string
  last_seen_at: string | null
  company?: { name: string } | null
}

/** Builds the SOCKS5 connection URI for a device, or "" if no gateway assigned. */
export function proxyUri(d: FleetDevice): string {
  if (!d.gateway_host || !d.socks_port || !d.socks_user || !d.socks_pass) return ""
  return `socks5://${d.socks_user}:${d.socks_pass}@${d.gateway_host}:${d.socks_port}`
}

/** Normalizes a MAC for identity comparison: strips separators, upper-cases.
 *  "00-1C-42-5B-9B-16" and "00:1c:42:5b:9b:16" → "001C425B9B16". */
function macKey(mac: string | null | undefined): string | null {
  if (!mac) return null
  const hex = mac.replace(/[^0-9a-fA-F]/g, "").toUpperCase()
  return hex.length === 12 ? hex : null
}

/**
 * Collapses rows that belong to the same physical device, keeping only the most
 * recently seen one — so each device shows a single row with its latest/active IP.
 * The input is expected newest-first (as returned by getFleetDevices), so the first
 * occurrence of each device wins.
 *
 * Device identity = MAC address (a device's stable hardware/derived id), falling
 * back to device_id when no MAC is present. Why MAC and not public_ip: the agent
 * (notably Windows) mints a fresh device_id on each enroll, producing many rows for
 * one machine — all sharing the same MAC but with stale/rotating IPs. Two different
 * devices behind one home router share an IP but differ by MAC, so MAC is the
 * correct key (IP-dedup would wrongly merge them).
 */
export function dedupeByDevice(devices: FleetDevice[]): FleetDevice[] {
  // Input is newest-heartbeat-first. Keep the latest row per device for live
  // status, but carry the proxy assignment forward from the most recent row that
  // had one — a re-enrollment mints a new row without the gateway, and the proxy
  // should still show (it's the same physical device, keyed by MAC).
  const byKey = new Map<string, FleetDevice>()
  const order: string[] = []
  for (const d of devices) {
    const key = macKey(d.mac_address) ?? `id:${d.device_id}`
    const base = byKey.get(key)
    if (!base) {
      byKey.set(key, { ...d })
      order.push(key)
    } else if (!base.gateway_host && d.gateway_host) {
      // latest row lacks an assignment; backfill from this (older) assigned row
      base.gateway_host = d.gateway_host
      base.socks_port = d.socks_port
      base.socks_user = d.socks_user
      base.socks_pass = d.socks_pass
    }
  }
  return order.map((k) => byKey.get(k)!)
}

/** A device is "online" if it reported a heartbeat within the last 5 minutes. */
export const ONLINE_WINDOW_MS = 5 * 60 * 1000

export function isOnline(lastSeenAt: string | null): boolean {
  if (!lastSeenAt) return false
  return Date.now() - new Date(lastSeenAt).getTime() < ONLINE_WINDOW_MS
}

function isExternalProxyDevice(device: FleetDevice): boolean {
  return (
    device.account_id === "EXTERNAL-PROXIES" ||
    device.last_trigger === "external_proxy" ||
    device.app_version === "external-proxy" ||
    device.device_id.startsWith("external-proxy-")
  )
}

function normalizeFleetDevice(device: FleetDevice): FleetDevice {
  if (!isExternalProxyDevice(device)) return device
  return {
    ...device,
    device_type: "linux",
    vpn_state: device.vpn_state ?? "on",
    last_trigger: "external_proxy",
    last_seen_at: device.last_seen_at ?? new Date().toISOString(),
  }
}

/** Fetches all fleet devices (newest heartbeat first). Server-only. */
export async function getFleetDevices(): Promise<FleetDevice[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("fleet_devices")
    .select("*, company:companies(name)")
    .order("last_seen_at", { ascending: false, nullsFirst: false })

  if (error) throw new Error(error.message)
  return ((data ?? []) as FleetDevice[]).map(normalizeFleetDevice)
}
