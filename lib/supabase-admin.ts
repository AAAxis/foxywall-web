import { createClient, SupabaseClient } from "@supabase/supabase-js"

let _admin: SupabaseClient | null = null

/**
 * Server-only Supabase client using the SERVICE ROLE key.
 * Bypasses RLS, so it can read the locked-down fleet tables.
 *
 * SECURITY: never import this from a Client Component or expose the key to the
 * browser. SUPABASE_SERVICE_ROLE_KEY must NOT be prefixed with NEXT_PUBLIC_.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error(
        "Supabase admin env vars not set (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)",
      )
    }
    _admin = createClient(url, key, { auth: { persistSession: false } })
  }
  return _admin
}
