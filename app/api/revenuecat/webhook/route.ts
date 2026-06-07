import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export const dynamic = "force-dynamic"

// RevenueCat event types that should GRANT (Pro on / extend).
const GRANT = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "NON_RENEWING_PURCHASE",
  "PRODUCT_CHANGE",
  "SUBSCRIPTION_EXTENDED",
])

// Only act on this FoxyWall entitlement — ignores Roamjet / other products.
const ENTITLEMENT = process.env.FOXYWALL_ENTITLEMENT_ID || "pro"

/** Simple GET so you can confirm the route is deployed. */
export async function GET() {
  return NextResponse.json({ ok: true, hook: "revenuecat", entitlement: ENTITLEMENT })
}

export async function POST(req: NextRequest) {
  // 1. Verify the shared secret RevenueCat sends in the Authorization header.
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET
  if (secret) {
    const auth = req.headers.get("authorization")
    if (auth !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 })
  }

  const ev = body?.event
  if (!ev) return NextResponse.json({ ok: true, skipped: "no event" })
  if (ev.type === "TEST") return NextResponse.json({ ok: true, test: true })

  // 2. Resolve the account — must be your VPN-XXXX code (set app_user_id = account code).
  const accountId = String(ev.app_user_id ?? "").trim().toUpperCase()
  if (!accountId || accountId.startsWith("$RCANONYMOUSID")) {
    return NextResponse.json({ ok: true, skipped: "no account id (set app_user_id = account code)" })
  }

  // 3. Filter to the FoxyWall entitlement only.
  const ents: string[] = Array.isArray(ev.entitlement_ids)
    ? ev.entitlement_ids
    : ev.entitlement_id
      ? [ev.entitlement_id]
      : []
  if (ents.length > 0 && !ents.includes(ENTITLEMENT)) {
    return NextResponse.json({ ok: true, skipped: `other entitlement (${ents.join(",")})` })
  }

  // 4. Decide grant/revoke.
  const t: string = ev.type
  const known = GRANT.has(t) || t === "CANCELLATION" || t === "EXPIRATION"
  if (!known) return NextResponse.json({ ok: true, skipped: `unhandled type ${t}` })

  let isPro: boolean
  if (t === "EXPIRATION") isPro = false
  else if (typeof ev.expiration_at_ms === "number") isPro = ev.expiration_at_ms > Date.now()
  else isPro = true // non-renewing / no expiry → grant

  const expiresAt =
    typeof ev.expiration_at_ms === "number" ? new Date(ev.expiration_at_ms).toISOString() : null
  const email = ev.subscriber_attributes?.["$email"]?.value ?? null
  const externalId = ev.original_transaction_id ?? ev.transaction_id ?? ev.product_id ?? null

  // 5. Write to Supabase (service-role → set_entitlement).
  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.rpc("set_entitlement", {
      p_account_id: accountId,
      p_is_pro: isPro,
      p_expires_at: expiresAt,
      p_source: "revenuecat",
      p_external_id: externalId,
      p_email: email,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "server error" },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true, account_id: accountId, is_pro: isPro, type: t })
}
