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

type ProxyServer = {
  id: string
  country: string
  country_code: string
  city: string | null
  host: string
  port: number
  username: string
  password: string
  enabled: boolean
}

type ProxyLineResponse = {
  count: number
  next: string | null
  previous: string | null
  results: ProxyLineProxy[]
}

type ProxyLineProxy = {
  id: number
  ip: string
  internal_ip: string | null
  port_http: number | null
  port_socks5: number | null
  user?: string
  username: string
  password: string
  order_id: number
  type: string
  ip_version: number
  country: string
  date: string
  date_end: string
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

function hasProxyCredentials(device: FleetDevice): boolean {
  return !!(device.gateway_host && device.socks_port && device.socks_user && device.socks_pass)
}

function sameHost(a: string | null | undefined, b: string | null | undefined): boolean {
  return !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase()
}

function virtualMac(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  const hex = hash.toString(16).padStart(12, "0").slice(-12).toUpperCase()
  return hex.match(/.{1,2}/g)?.join(":") ?? hex
}

export function isExternalProxyDevice(device: FleetDevice): boolean {
  return (
    device.account_id === "EXTERNAL-PROXIES" ||
    device.last_trigger === "external_proxy" ||
    device.app_version === "external-proxy" ||
    device.device_id.startsWith("external-proxy-") ||
    (hasProxyCredentials(device) && sameHost(device.public_ip, device.gateway_host))
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

export async function getProxyServerFleetDevices(): Promise<FleetDevice[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("proxy_servers")
    .select("id,country,country_code,city,host,port,username,password,enabled")
    .eq("enabled", true)
    .like("id", "socks-%")
    .order("sort", { ascending: true })

  if (error) throw new Error(error.message)

  return ((data ?? []) as ProxyServer[]).map((proxy, index) => ({
    id: `proxy-server-${proxy.id}`,
    company_id: "external-proxies",
    account_id: "EXTERNAL-PROXIES",
    device_id: `external-proxy-${proxy.id}`,
    device_name: `External ${proxy.country_code} ${index + 1}`,
    device_type: "linux",
    device_token: "",
    app_version: "external-proxy",
    public_ip: proxy.host,
    vpn_state: "on",
    last_trigger: "external_proxy",
    rx_bytes: null,
    tx_bytes: null,
    speed_down_bps: null,
    speed_up_bps: null,
    mac_address: virtualMac(proxy.id),
    last_seen_at: new Date().toISOString(),
    gateway_host: proxy.host,
    socks_port: proxy.port,
    socks_user: proxy.username,
    socks_pass: proxy.password,
    exit_enabled: true,
    enrolled_at: new Date().toISOString(),
    company: { name: proxy.city ? `${proxy.city}, ${proxy.country}` : proxy.country },
  }))
}

export async function getProxyLineFleetDevices(): Promise<FleetDevice[]> {
  const apiKey = process.env.PROXYLINE_API_KEY
  if (!apiKey) return []

  const proxies: ProxyLineProxy[] = []
  const limit = 2000
  let offset = 0

  while (true) {
    const url = new URL("https://panel.proxyline.net/api/proxies/")
    url.searchParams.set("status", "active")
    url.searchParams.set("limit", String(limit))
    url.searchParams.set("offset", String(offset))

    const res = await fetch(url, {
      headers: { "API-KEY": apiKey },
      next: { revalidate: 60 },
    })
    if (!res.ok) {
      throw new Error(`ProxyLine request failed (${res.status})`)
    }

    const page = (await res.json()) as ProxyLineResponse
    proxies.push(...(page.results ?? []))
    if (!page.next || proxies.length >= (page.count ?? proxies.length)) break
    offset += limit
  }

  return proxies
    .filter((proxy) => proxy.ip && proxy.port_socks5 && proxy.username && proxy.password)
    .map((proxy, index) => {
      const countryCode = proxy.country.toUpperCase()
      return {
        id: `proxyline-${proxy.id}`,
        company_id: "proxyline",
        account_id: "PROXYLINE",
        device_id: `proxyline-${proxy.id}`,
        device_name: `ProxyLine ${countryCode} ${index + 1}`,
        device_type: "linux",
        app_version: "proxyline",
        public_ip: proxy.ip,
        vpn_state: "on",
        last_trigger: "proxyline",
        rx_bytes: null,
        tx_bytes: null,
        speed_down_bps: null,
        speed_up_bps: null,
        mac_address: virtualMac(`proxyline-${proxy.id}`),
        last_seen_at: new Date().toISOString(),
        gateway_host: proxy.ip,
        socks_port: proxy.port_socks5,
        socks_user: proxy.username,
        socks_pass: proxy.password,
        exit_enabled: true,
        enrolled_at: proxy.date,
        company: { name: `ProxyLine order ${proxy.order_id}` },
      } satisfies FleetDevice
    })
}
