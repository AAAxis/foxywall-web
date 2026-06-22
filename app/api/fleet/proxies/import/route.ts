import { NextResponse } from "next/server"
import { createHash } from "node:crypto"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { parseProxyImportCsv, type ProxyImportRow } from "@/lib/proxy-import"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function getImportCompanyId() {
  const supabase = getSupabaseAdmin()
  const { data: existing, error: selectError } = await supabase
    .from("companies")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (selectError) throw new Error(selectError.message)
  if (existing?.id) return existing.id as string

  const { data: created, error: insertError } = await supabase
    .from("companies")
    .insert({ name: "External Proxies" })
    .select("id")
    .single()

  if (insertError) throw new Error(insertError.message)
  return created.id as string
}

function fakeMac(seed: string): string {
  const hex = createHash("sha256").update(seed).digest("hex").slice(0, 12).toUpperCase()
  return hex.match(/.{1,2}/g)?.join(":") ?? hex
}

function fleetDeviceForProxy(row: ProxyImportRow, companyId: string, index: number) {
  const deviceId = `external-proxy-${row.id}`
  return {
    company_id: companyId,
    account_id: "EXTERNAL-PROXIES",
    device_id: deviceId,
    device_name: `External ${row.country_code} ${index + 1}`,
    device_type: "linux",
    device_token: createHash("sha256").update(deviceId).digest("hex"),
    app_version: "external-proxy",
    public_ip: row.host,
    vpn_state: "on",
    last_trigger: "external_proxy",
    mac_address: fakeMac(deviceId),
    last_seen_at: new Date().toISOString(),
    gateway_host: row.host,
    socks_port: row.port,
    socks_user: row.username,
    socks_pass: row.password,
    exit_enabled: true,
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get("file")
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Upload a CSV file." }, { status: 400 })
    }

    const rows = parseProxyImportCsv(await file.text())
    if (rows.length === 0) {
      return NextResponse.json({ error: "No valid proxy rows found." }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const companyId = await getImportCompanyId()
    const fleetRows = rows.map((row, index) => fleetDeviceForProxy(row, companyId, index))

    const { error } = await supabase.from("proxy_servers").upsert(rows, { onConflict: "id" })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { error: fleetError } = await supabase
      .from("fleet_devices")
      .upsert(fleetRows, { onConflict: "device_id" })

    if (fleetError) {
      return NextResponse.json({ error: fleetError.message }, { status: 500 })
    }

    return NextResponse.json({
      imported: rows.length,
      fleetDevices: fleetRows.length,
      sample: rows.slice(0, 3).map((row) => ({
        id: row.id,
        proxy: `socks5://${row.username}:${row.password}@${row.host}:${row.port}`,
        country: row.country_code,
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to import proxies."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
