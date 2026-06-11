import type { DeviceType, FleetDevice } from "@/lib/fleet"

const PLATFORM: Record<DeviceType, { label: string; glyph: string; className: string }> = {
  windows: { label: "Windows", glyph: "🪟", className: "bg-sky-500/20 ring-sky-400/40" },
  android: { label: "Android", glyph: "🤖", className: "bg-emerald-500/20 ring-emerald-400/40" },
  ios: { label: "iOS", glyph: "", className: "bg-white/10 ring-white/30" },
  macos: { label: "macOS", glyph: "", className: "bg-indigo-500/20 ring-indigo-400/40" },
  other: { label: "Other", glyph: "💻", className: "bg-white/10 ring-white/20" },
}

export function PlatformBadge({ type }: { type: DeviceType }) {
  const p = PLATFORM[type] ?? PLATFORM.other
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-inset ${p.className}`}
    >
      <span aria-hidden>{p.glyph}</span>
      {p.label}
    </span>
  )
}

export function OnlineDot({ online }: { online: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white">
      <span
        className={`h-2 w-2 rounded-full ${online ? "bg-emerald-400" : "bg-white/30"}`}
        aria-hidden
      />
      {online ? "Online" : "Offline"}
    </span>
  )
}

export function VpnStatePill({ state }: { state: FleetDevice["vpn_state"] }) {
  if (state === "on") {
    return (
      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-emerald-400/40">
        VPN on
      </span>
    )
  }
  if (state === "off") {
    return (
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-white/20">
        VPN off
      </span>
    )
  }
  return <span className="text-xs text-white">—</span>
}
