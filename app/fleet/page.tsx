import type { ReactNode } from "react"
import { formatDistanceToNow } from "date-fns"
import { getFleetDevices, isOnline, type FleetDevice } from "@/lib/fleet"
import { OnlineDot, PlatformBadge, VpnStatePill } from "@/components/fleet/device-badges"

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
    devices = await getFleetDevices()
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load devices."
  }

  const online = devices.filter((d) => isOnline(d.last_seen_at)).length

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fleet</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Enrolled devices and their latest heartbeat.
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <Stat label="Devices" value={String(devices.length)} />
          <Stat label="Online" value={String(online)} accent />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Could not load fleet</p>
          <p className="mt-1 text-red-600">{error}</p>
          <p className="mt-2 text-xs text-red-500">
            Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, and that the
            fleet schema migration has been applied.
          </p>
        </div>
      ) : devices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500">
          No devices enrolled yet. Enroll a device with a provision code to see it here.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <Th>Device</Th>
                <Th>Platform</Th>
                <Th>Status</Th>
                <Th>Public IP</Th>
                <Th>VPN</Th>
                <Th>Version</Th>
                <Th>Company</Th>
                <Th>Last seen</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {devices.map((d) => (
                <tr key={d.id} className="hover:bg-zinc-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">{d.device_name ?? "Unnamed"}</div>
                    <div className="font-mono text-xs text-zinc-400">{d.device_id}</div>
                  </td>
                  <td className="px-4 py-3"><PlatformBadge type={d.device_type} /></td>
                  <td className="px-4 py-3"><OnlineDot online={isOnline(d.last_seen_at)} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-600">{d.public_ip ?? "—"}</td>
                  <td className="px-4 py-3"><VpnStatePill state={d.vpn_state} /></td>
                  <td className="px-4 py-3 text-zinc-600">{d.app_version ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{d.company?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-500">{lastSeen(d)}</td>
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

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-right">
      <div className={`text-2xl font-bold ${accent ? "text-emerald-600" : "text-zinc-900"}`}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-zinc-400">{label}</div>
    </div>
  )
}
