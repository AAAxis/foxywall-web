/** Human-readable data size (base 1024): 13314398617 → "12.4 GB". */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB", "PB"]
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/** Human-readable network speed from bits/sec (base 1000): 4500000 → "4.5 Mbps". */
export function formatBps(bps: number | null | undefined): string {
  if (bps == null || bps <= 0) return "0 bps"
  const units = ["bps", "Kbps", "Mbps", "Gbps"]
  const i = Math.min(Math.floor(Math.log(bps) / Math.log(1000)), units.length - 1)
  const value = bps / Math.pow(1000, i)
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}
