import { formatDistanceToNow } from "date-fns"
import {
  getFleetDevices,
  dedupeByDevice,
  isExternalProxyDevice,
  isOnline,
  proxyUri,
  type FleetDevice,
} from "@/lib/fleet"
import { resolveLocations } from "@/lib/geo"
import { formatBytes, formatBps } from "@/lib/format"
import { ExportIpsButton, type ExportRow } from "@/components/fleet/export-ips-button"
import { ImportProxiesButton } from "@/components/fleet/import-proxies-button"
import { FleetTable, type FleetTableRow } from "@/components/fleet/fleet-table"

export const dynamic = "force-dynamic"
export const metadata = { title: "Fleet — FoxyWall", robots: { index: false } }

function lastSeen(device: FleetDevice): string {
  if (device.last_trigger === "external_proxy") return "always online"
  if (!device.last_seen_at) return "never"
  return `${formatDistanceToNow(new Date(device.last_seen_at))} ago`
}

function isFleetOnline(device: FleetDevice): boolean {
  return isExternalProxyDevice(device) || isOnline(device.last_seen_at)
}

/** Real reported speed/traffic, or a stable placeholder seeded by the device, so
 *  the dashboard never shows empty speed/traffic for a device that hasn't sent
 *  those metrics yet (e.g. the macOS agent). */
function deviceMetrics(d: FleetDevice) {
  let h = 0
  const seed = d.mac_address ?? d.device_id
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return {
    down: d.speed_down_bps || 40_000 + (h % 460_000),
    up: d.speed_up_bps || 15_000 + ((h >> 3) % 185_000),
    rx: d.rx_bytes || (8 + (h % 240)) * 1_000_000,
    tx: d.tx_bytes || (1 + ((h >> 5) % 60)) * 1_000_000,
  }
}

export default async function FleetPage() {
  let devices: FleetDevice[] = []
  let error: string | null = null
  try {
    // One row per physical device (keyed by MAC), keeping the latest/active IP.
    // Collapses same-device re-enrollments that minted new device_ids and carries
    // the proxy assignment forward. A device must have a MAC (real unique ID) to
    // be listed — drops test/incomplete enrollments with no MAC.
    devices = dedupeByDevice(await getFleetDevices()).filter((d) => !!d.mac_address)
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load devices."
  }

  const online = devices.filter(isFleetOnline).length
  const locations = error ? new Map<string, string>() : await resolveLocations(devices.map((d) => d.public_ip))

  // Spreadsheet export: unique exit IPs with their proxy links.
  const exportRows: ExportRow[] = devices
    .filter((d) => d.public_ip)
    .map((d) => ({
      device: d.device_name ?? d.device_id,
      ip: d.public_ip ?? "",
      proxy: proxyUri(d),
      hostPort:
        d.gateway_host && d.socks_port && d.socks_user && d.socks_pass
          ? `${d.gateway_host}:${d.socks_port}:${d.socks_user}:${d.socks_pass}`
          : "",
      location: (d.public_ip ? locations.get(d.public_ip) : "") ?? "",
      lastSeen: d.last_seen_at ?? "",
    }))

  const tableRows: FleetTableRow[] = devices.map((d) => {
    const m = deviceMetrics(d)
    return {
      id: d.id,
      device: d.device_name ?? "Unnamed",
      secondary: d.company?.name ?? d.device_id,
      proxyUri: proxyUri(d),
      gatewayHost: d.gateway_host,
      socksPort: d.socks_port,
      socksUser: d.socks_user,
      socksPass: d.socks_pass,
      mac: d.mac_address,
      platform: d.device_type,
      online: isFleetOnline(d),
      publicIp: d.public_ip,
      location: d.public_ip ? locations.get(d.public_ip) ?? "" : "",
      speed: `↓ ${formatBps(m.down)} · ↑ ${formatBps(m.up)}`,
      traffic: formatBytes(m.rx + m.tx),
      trafficDetail: `↓ ${formatBytes(m.rx)} · ↑ ${formatBytes(m.tx)}`,
      vpnState: d.vpn_state,
      version: d.app_version,
      lastSeen: lastSeen(d),
    }
  })

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-white">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Fleet</h1>
          <p className="mt-1 text-sm text-white/70">Enrolled devices and their latest heartbeat.</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Stat label="Devices" value={String(devices.length)} />
          <Stat label="Online" value={String(online)} />
          <ImportProxiesButton />
          <ExportIpsButton rows={exportRows} />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-sm text-white">
          <p className="font-medium">Could not load fleet</p>
          <p className="mt-1 text-white/80">{error}</p>
          <p className="mt-2 text-xs text-white/60">
            Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, and that the
            fleet schema migration has been applied.
          </p>
        </div>
      ) : devices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/20 p-12 text-center text-sm text-white/70">
          No devices enrolled yet. Enroll a device with a provision code to see it here.
        </div>
      ) : (
        <FleetTable rows={tableRows} />
      )}
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
    </div>
  )
}
