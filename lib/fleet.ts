import { getSupabaseAdmin } from "./supabase-admin"

export type DeviceType = "ios" | "android" | "windows" | "other"

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

/**
 * Collapses rows that share the same public_ip, keeping only the most recently
 * seen one. The input is expected newest-first (as returned by getFleetDevices),
 * so the first occurrence of each IP wins — that's the freshest/online device for
 * that exit IP. Rows without a public_ip are passed through untouched (each is its
 * own entry — they can't be duplicate IPs).
 *
 * Why: multiple physical devices behind the same home router NAT to one public IP,
 * and the same device re-enrolling under a new device_id creates a second row with
 * an identical IP. For a residential-exit fleet the exit IP is the unit that
 * matters, so we show one row per unique IP.
 */
export function dedupeByIp(devices: FleetDevice[]): FleetDevice[] {
  const seen = new Set<string>()
  const out: FleetDevice[] = []
  for (const d of devices) {
    const ip = d.public_ip?.trim()
    if (ip) {
      if (seen.has(ip)) continue
      seen.add(ip)
    }
    out.push(d)
  }
  return out
}

/** A device is "online" if it reported a heartbeat within the last 5 minutes. */
export const ONLINE_WINDOW_MS = 5 * 60 * 1000

export function isOnline(lastSeenAt: string | null): boolean {
  if (!lastSeenAt) return false
  return Date.now() - new Date(lastSeenAt).getTime() < ONLINE_WINDOW_MS
}

/** Fetches all fleet devices (newest heartbeat first). Server-only. */
export async function getFleetDevices(): Promise<FleetDevice[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("fleet_devices")
    .select("*, company:companies(name)")
    .order("last_seen_at", { ascending: false, nullsFirst: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as FleetDevice[]
}
