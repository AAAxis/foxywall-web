import type { ReactNode } from "react"
import { formatDistanceToNow } from "date-fns"
import { getFleetDevices, dedupeByDevice, isOnline, proxyUri, type FleetDevice } from "@/lib/fleet"
import { resolveLocations } from "@/lib/geo"
import { formatBytes, formatBps } from "@/lib/format"
import { OnlineDot, PlatformBadge, VpnStatePill } from "@/components/fleet/device-badges"
import { CopyProxyButton } from "@/components/fleet/copy-proxy-button"
import { ExportIpsButton, type ExportRow } from "@/components/fleet/export-ips-button"

export const dynamic = "force-dynamic"
export const metadata = { title: "Fleet — FoxyWall", robots: { index: false } }

function lastSeen(device: FleetDevice): string {
  if (!device.last_seen_at) return "never"
  return `${formatDistanceToNow(new Date(device.last_seen_at))} ago`
}

export default async function FleetPage() {
  let devices: FleetDevice[] = []
  let error: string | null = null
  try {
    // One row per physical device (keyed by MAC), keeping the latest/active IP.
    // Collapses same-device re-enrollments that minted new device_ids.
    devices = dedupeByDevice(await getFleetDevices())
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load devices."
  }

  const online = devices.filter((d) => isOnline(d.last_seen_at)).length
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
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[1100px] text-left text-sm text-white">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/70">
              <tr>
                <Th>Device</Th>
                <Th>Proxy</Th>
                <Th>MAC</Th>
                <Th>Platform</Th>
                <Th>Status</Th>
                <Th>Public IP</Th>
                <Th>Location</Th>
                <Th>Speed</Th>
                <Th>Traffic</Th>
                <Th>VPN</Th>
                <Th>Version</Th>
                <Th>Last seen</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {devices.map((d) => (
                <tr key={d.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{d.device_name ?? "Unnamed"}</div>
                    <div className="font-mono text-xs text-white/50">{d.company?.name ?? d.device_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <CopyProxyButton
                      uri={proxyUri(d)}
                      host={d.gateway_host}
                      port={d.socks_port}
                      user={d.socks_user}
                      pass={d.socks_pass}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-white/80">{d.mac_address ?? "—"}</td>
                  <td className="px-4 py-3"><PlatformBadge type={d.device_type} /></td>
                  <td className="px-4 py-3"><OnlineDot online={isOnline(d.last_seen_at)} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-white/80">{d.public_ip ?? "—"}</td>
                  <td className="px-4 py-3 text-white/80">
                    {d.public_ip ? locations.get(d.public_ip) ?? "—" : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-white/80">
                    {d.speed_down_bps || d.speed_up_bps ? (
                      <span>↓ {formatBps(d.speed_down_bps)} · ↑ {formatBps(d.speed_up_bps)}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-white/80">
                    {d.rx_bytes || d.tx_bytes ? (
                      <>
                        <div className="font-medium text-white">
                          {formatBytes((d.rx_bytes ?? 0) + (d.tx_bytes ?? 0))}
                        </div>
                        <div className="text-xs text-white/50">
                          ↓ {formatBytes(d.rx_bytes)} · ↑ {formatBytes(d.tx_bytes)}
                        </div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3"><VpnStatePill state={d.vpn_state} /></td>
                  <td className="px-4 py-3 text-white/80">{d.app_version ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-white/70">{lastSeen(d)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
    </div>
  )
}
