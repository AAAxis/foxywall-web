"use client"

import { useState } from "react"

/**
 * Copies a device's proxy connection string. Click toggles between the SOCKS5 URI
 * and the host:port:user:pass format (what anti-detect browsers auto-fill from).
 */
export function CopyProxyButton({
  uri,
  host,
  port,
  user,
  pass,
}: {
  uri: string
  host: string | null
  port: number | null
  user: string | null
  pass: string | null
}) {
  const [copied, setCopied] = useState(false)

  if (!uri) return <span className="text-xs text-white/30">—</span>

  const plain = `${host}:${port}:${user}:${pass}`

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => copy(uri)}
        title={uri}
        className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-white ring-1 ring-inset ring-emerald-400/40 hover:bg-emerald-500/30"
      >
        {copied ? "Copied ✓" : "Copy proxy"}
      </button>
      <button
        onClick={() => copy(plain)}
        title={`Copy as host:port:user:pass — ${plain}`}
        className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/70 ring-1 ring-inset ring-white/20 hover:bg-white/20"
      >
        h:p:u:p
      </button>
    </div>
  )
}
