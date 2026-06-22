import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { parseProxyImportCsv } from "@/lib/proxy-import"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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
    const { error } = await supabase.from("proxy_servers").upsert(rows, { onConflict: "id" })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      imported: rows.length,
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
