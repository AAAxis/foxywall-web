"use client"

import { useState } from "react"

/**
 * Copies a device's proxy connection string. Click toggles between the SOCKS5 URI
 * and the host:port:user:pass format (what anti-detect browsers auto-fill from).
 */
export function CopyProxyButton({
  uri,
}: {
  uri: string
}) {
  const [copied, setCopied] = useState(false)

  if (!uri) return <span className="text-xs text-white/30">—</span>

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
    <button
      onClick={() => copy(uri)}
      title={uri}
      className="whitespace-nowrap rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-white ring-1 ring-inset ring-emerald-400/40 hover:bg-emerald-500/30"
    >
      {copied ? "Copied ✓" : "Copy proxy"}
    </button>
  )
}
