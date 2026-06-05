import { NextRequest, NextResponse } from "next/server"

// Protect the fleet dashboard with HTTP Basic Auth.
// Set FLEET_USER and FLEET_PASS in the environment to enable. If either is unset
// (e.g. local dev), the route is left open so you can iterate without a login.
export const config = { matcher: ["/fleet/:path*"] }

export function middleware(req: NextRequest) {
  const user = process.env.FLEET_USER
  const pass = process.env.FLEET_PASS
  if (!user || !pass) return NextResponse.next()

  const header = req.headers.get("authorization")
  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6))
      const sep = decoded.indexOf(":")
      const u = decoded.slice(0, sep)
      const p = decoded.slice(sep + 1)
      if (u === user && p === pass) return NextResponse.next()
    } catch {
      /* malformed header → fall through to 401 */
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="FoxyWall Fleet"' },
  })
}
