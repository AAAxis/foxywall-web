"use client"

/**
 * Exports the (deduped) fleet exit IPs and their proxy links to a spreadsheet.
 *
 * Generates a CSV with a UTF-8 BOM so Excel opens it cleanly (double-click → opens
 * in Excel, columns intact, no import wizard). Zero dependencies. Each row is one
 * unique exit IP with its SOCKS5 URI and the host:port:user:pass form that
 * anti-detect browsers auto-fill from.
 */
export type ExportRow = {
  device: string
  ip: string
  proxy: string // socks5://user:pass@host:port  ("" if no gateway assigned)
  hostPort: string // host:port:user:pass         ("" if no gateway assigned)
  location: string
  lastSeen: string
}

const COLUMNS: { key: keyof ExportRow; header: string }[] = [
  { key: "device", header: "Device" },
  { key: "ip", header: "Public IP" },
  { key: "proxy", header: "Proxy (SOCKS5)" },
  { key: "hostPort", header: "host:port:user:pass" },
  { key: "location", header: "Location" },
  { key: "lastSeen", header: "Last seen" },
]

/** RFC-4180 cell escaping: wrap in quotes and double any embedded quotes. */
function cell(value: string): string {
  const v = value ?? ""
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
}

function toCsv(rows: ExportRow[]): string {
  const header = COLUMNS.map((c) => cell(c.header)).join(",")
  const body = rows.map((r) => COLUMNS.map((c) => cell(String(r[c.key] ?? ""))).join(",")).join("\r\n")
  return `${header}\r\n${body}`
}

export function ExportIpsButton({ rows }: { rows: ExportRow[] }) {
  function download() {
    // BOM (﻿) makes Excel read it as UTF-8.
    const blob = new Blob(["﻿" + toCsv(rows)], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foxywall-exit-ips-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={download}
      disabled={rows.length === 0}
      title="Download unique exit IPs and proxy links as a spreadsheet (CSV, opens in Excel)"
      className="rounded-md bg-emerald-500/20 px-3 py-2 text-sm font-medium text-white ring-1 ring-inset ring-emerald-400/40 hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Export IPs ({rows.length})
    </button>
  )
}
