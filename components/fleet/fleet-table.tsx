"use client"

import { useMemo, useState } from "react"
import { CopyProxyButton } from "@/components/fleet/copy-proxy-button"
import { OnlineDot, PlatformBadge, VpnStatePill } from "@/components/fleet/device-badges"
import type { DeviceType, FleetDevice } from "@/lib/fleet"

export type FleetTableRow = {
  id: string
  device: string
  secondary: string
  proxyUri: string
  gatewayHost: string | null
  socksPort: number | null
  socksUser: string | null
  socksPass: string | null
  mac: string | null
  platform: DeviceType
  online: boolean
  publicIp: string | null
  location: string
  speed: string
  traffic: string
  trafficDetail: string
  vpnState: FleetDevice["vpn_state"]
  version: string | null
  lastSeen: string
}

type FilterKey = "device" | "proxy" | "mac" | "platform" | "status" | "publicIp" | "location" | "speed"

const FILTER_HEADERS: { key: FilterKey; label: string }[] = [
  { key: "device", label: "Device" },
  { key: "proxy", label: "Proxy" },
  { key: "mac", label: "MAC" },
  { key: "platform", label: "Platform" },
  { key: "status", label: "Status" },
  { key: "publicIp", label: "Public IP" },
  { key: "location", label: "Location" },
  { key: "speed", label: "Speed" },
]

function filterValue(row: FleetTableRow, key: FilterKey): string {
  if (key === "proxy") return row.proxyUri ? "Has proxy" : "No proxy"
  if (key === "status") return row.online ? "Online" : "Offline"
  if (key === "platform") return row.platform
  return String(row[key] ?? "")
}

function uniqueFilterValues(rows: FleetTableRow[], key: FilterKey): string[] {
  return [...new Set(rows.map((row) => filterValue(row, key) || "—"))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  )
}

export function FleetTable({ rows }: { rows: FleetTableRow[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null)
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({})
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        Object.entries(filters).every(([key, value]) => !value || (filterValue(row, key as FilterKey) || "—") === value),
      ),
    [filters, rows],
  )

  const activeValues = useMemo(
    () => (activeFilter ? uniqueFilterValues(rows, activeFilter) : []),
    [activeFilter, rows],
  )

  function header(label: string, key?: FilterKey) {
    if (!key) return <th className="px-4 py-3 font-medium">{label}</th>
    const isActive = activeFilter === key
    const hasFilter = !!filters[key]?.trim()
    return (
      <th className="px-4 py-3 font-medium">
        <button
          type="button"
          onClick={() => setActiveFilter(isActive ? null : key)}
          className={`rounded px-1 text-left uppercase tracking-wide hover:text-white ${hasFilter ? "text-orange-300" : ""}`}
          title={`Tap to filter ${label}`}
        >
          {label}
        </button>
      </th>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      {activeFilterCount > 0 ? (
        <div className="flex items-center gap-2 border-b border-white/10 bg-orange-500/10 px-4 py-2 text-xs text-white/70">
          <span>{activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"} active</span>
          <button
            type="button"
            onClick={() => {
              setFilters({})
              setActiveFilter(null)
            }}
            className="rounded-md bg-orange-500 px-2.5 py-1 font-medium text-black hover:bg-orange-400"
          >
            Reset filters
          </button>
        </div>
      ) : null}

      {activeFilter ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
          <span className="text-white/60">
            Filter {FILTER_HEADERS.find((item) => item.key === activeFilter)?.label}
          </span>
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, [activeFilter]: undefined }))}
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
              filters[activeFilter] ? "bg-white/10 text-white/70 ring-white/15" : "bg-orange-500 text-black ring-orange-400"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters({})
              setActiveFilter(null)
            }}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/75 ring-1 ring-inset ring-white/15 hover:bg-white/15"
          >
            Reset
          </button>
          {activeValues.map((value) => {
            const selected = filters[activeFilter] === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilters((current) => ({ ...current, [activeFilter]: selected ? undefined : value }))}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                  selected
                    ? "bg-orange-500 text-black ring-orange-400"
                    : "bg-white/10 text-white/75 ring-white/15 hover:bg-white/15"
                }`}
              >
                {value}
              </button>
            )
          })}
          <span className="ml-auto text-xs text-white/45">{filteredRows.length} rows</span>
        </div>
      ) : null}

      <table className="w-full min-w-[1100px] text-left text-sm text-white">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/70">
          <tr>
            {header("Device", "device")}
            {header("Proxy", "proxy")}
            {header("MAC", "mac")}
            {header("Platform", "platform")}
            {header("Status", "status")}
            {header("Public IP", "publicIp")}
            {header("Location", "location")}
            {header("Speed", "speed")}
            {header("Traffic")}
            {header("VPN")}
            {header("Version")}
            {header("Last seen")}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {filteredRows.map((row) => (
            <tr key={row.id} className="hover:bg-white/5">
              <td className="px-4 py-3">
                <div className="font-medium text-white">{row.device}</div>
                <div className="font-mono text-xs text-white/50">{row.secondary}</div>
              </td>
              <td className="px-4 py-3">
                <CopyProxyButton
                  uri={row.proxyUri}
                  host={row.gatewayHost}
                  port={row.socksPort}
                  user={row.socksUser}
                  pass={row.socksPass}
                />
              </td>
              <td className="px-4 py-3 font-mono text-xs text-white/80">{row.mac ?? "—"}</td>
              <td className="px-4 py-3"><PlatformBadge type={row.platform} /></td>
              <td className="px-4 py-3"><OnlineDot online={row.online} /></td>
              <td className="px-4 py-3 font-mono text-xs text-white/80">{row.publicIp ?? "—"}</td>
              <td className="px-4 py-3 text-white/80">{row.location || "—"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-white/80">{row.speed}</td>
              <td className="whitespace-nowrap px-4 py-3 text-white/80">
                <div className="font-medium text-white">{row.traffic}</div>
                <div className="text-xs text-white/50">{row.trafficDetail}</div>
              </td>
              <td className="px-4 py-3"><VpnStatePill state={row.vpnState} /></td>
              <td className="px-4 py-3 text-white/80">{row.version ?? "—"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-white/70">{row.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
