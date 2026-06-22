export type ProxyImportRow = {
  id: string
  city: string | null
  country: string
  country_code: string
  host: string
  port: number
  username: string
  password: string
  is_default: boolean
  enabled: boolean
  sort: number
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  IL: "Israel",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  SE: "Sweden",
  CA: "Canada",
  BR: "Brazil",
  JP: "Japan",
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = []
  let cell = ""
  let quoted = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cell += '"'
        i++
      } else {
        quoted = !quoted
      }
    } else if (ch === delimiter && !quoted) {
      cells.push(cell.trim())
      cell = ""
    } else {
      cell += ch
    }
  }

  cells.push(cell.trim())
  return cells.map((value) => value.replace(/^"|"$/g, ""))
}

function detectDelimiter(header: string): string {
  const delimiters = [";", ",", "\t"]
  return delimiters
    .map((delimiter) => ({ delimiter, count: header.split(delimiter).length }))
    .sort((a, b) => b.count - a.count)[0]?.delimiter ?? ";"
}

function normalizeHeader(value: string): string {
  return value.replace(/^\uFEFF/, "").trim().toLowerCase()
}

function safeId(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "")
}

function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code
}

export function parseProxyImportCsv(text: string): ProxyImportRow[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter((line) => line.trim())
  if (lines.length < 2) return []

  const delimiter = detectDelimiter(lines[0])
  const headers = splitCsvLine(lines[0], delimiter).map(normalizeHeader)
  const index = Object.fromEntries(headers.map((header, i) => [header, i]))

  const required = ["id", "ip", "port_socks5", "username", "password"]
  const missing = required.filter((key) => index[key] === undefined)
  if (missing.length) {
    throw new Error(`Missing required column(s): ${missing.join(", ")}`)
  }

  return lines.slice(1).flatMap((line, rowIndex) => {
    const cells = splitCsvLine(line, delimiter)
    const get = (key: string) => cells[index[key]]?.trim() ?? ""

    const sourceId = get("id") || String(rowIndex + 1)
    const host = get("ip")
    const port = Number.parseInt(get("port_socks5"), 10)
    const username = get("username")
    const password = get("password")
    const countryCode = (get("country") || "US").toUpperCase()

    if (!host || !Number.isInteger(port) || port <= 0 || !username || !password) {
      return []
    }

    return [{
      id: `socks-${countryCode.toLowerCase()}-${safeId(sourceId)}`,
      city: null,
      country: countryName(countryCode),
      country_code: countryCode,
      host,
      port,
      username,
      password,
      is_default: false,
      enabled: true,
      sort: 1000 + rowIndex,
    }]
  })
}
