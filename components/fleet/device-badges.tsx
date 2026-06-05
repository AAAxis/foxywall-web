import type { DeviceType, FleetDevice } from "@/lib/fleet"

const PLATFORM: Record<DeviceType, { label: string; glyph: string; className: string }> = {
  windows: { label: "Windows", glyph: "🪟", className: "bg-sky-500/10 text-sky-600 ring-sky-500/20" },
  android: { label: "Android", glyph: "🤖", className: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20" },
  ios: { label: "iOS", glyph: "", className: "bg-zinc-500/10 text-zinc-600 ring-zinc-500/20" },
  other: { label: "Other", glyph: "💻", className: "bg-zinc-500/10 text-zinc-500 ring-zinc-500/20" },
}

export function PlatformBadge({ type }: { type: DeviceType }) {
  const p = PLATFORM[type] ?? PLATFORM.other
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${p.className}`}
    >
      <span aria-hidden>{p.glyph}</span>
      {p.label}
    </span>
  )
}

export function OnlineDot({ online }: { online: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span
        className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-zinc-300"}`}
        aria-hidden
      />
      <span className={online ? "text-emerald-600" : "text-zinc-400"}>
        {online ? "Online" : "Offline"}
      </span>
    </span>
  )
}

export function VpnStatePill({ state }: { state: FleetDevice["vpn_state"] }) {
  if (state === "on") {
    return (
      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
        VPN on
      </span>
    )
  }
  if (state === "off") {
    return (
      <span className="rounded-full bg-zinc-500/10 px-2 py-0.5 text-xs font-medium text-zinc-500 ring-1 ring-inset ring-zinc-500/20">
        VPN off
      </span>
    )
  }
  return <span className="text-xs text-zinc-400">—</span>
}
