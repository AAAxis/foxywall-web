type GeoResult = {
  query: string
  status: string
  country?: string
  countryCode?: string
  city?: string
}

/**
 * Resolves public IPs to "City, Country" labels via ip-api.com (free batch endpoint).
 * Best-effort: any failure yields an empty map and the UI shows "—".
 *
 * NOTE: this sends device public IPs to a third-party service. For an internal admin
 * dashboard that's usually fine; if not, store geo at heartbeat time instead.
 */
export async function resolveLocations(ips: Array<string | null>): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const unique = [...new Set(ips.filter((ip): ip is string => !!ip))].slice(0, 100)
  if (unique.length === 0) return map

  try {
    const res = await fetch("http://ip-api.com/batch?fields=status,country,countryCode,city,query", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(unique),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return map
    const data = (await res.json()) as GeoResult[]
    for (const g of data) {
      if (g.status !== "success") continue
      const label = [g.city, g.country].filter(Boolean).join(", ")
      if (label) map.set(g.query, label)
    }
  } catch {
    /* network / rate-limit → no locations */
  }
  return map
}
