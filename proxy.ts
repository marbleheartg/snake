import verifySession from "@/lib/api/utils/verifySession"
import { MINIAPP, MINIAPP_METADATA } from "@/lib/constants"
import { NextRequest, NextResponse } from "next/server"

const { NEXT_PUBLIC_HOST } = process.env
if (!NEXT_PUBLIC_HOST) throw new Error("NextConfigCredentialsNotConfigured")

export const config = {
  matcher: ["/api/:path*", "/og"],
}

const protectedRoutes = [""]

export async function proxy(request: NextRequest) {
  if (request.headers.get("x-middleware-subrequest")) return NextResponse.json({ error: "Forbidden header detected" }, { status: 403 })

  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api")) {
    if (request.method === "GET") return NextResponse.next()

    if (!protectedRoutes.includes(pathname)) return NextResponse.next()

    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 })

    const session = authHeader.split(" ")[1]

    const fid = await verifySession(session)

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("fid", fid.toString())

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  if (pathname.startsWith("/og")) {
    const userAgent = request.headers.get("user-agent")?.toLowerCase() || ""

    if (userAgent.includes("fcbot") || userAgent.includes("base dev")) {
      const param = request.nextUrl.searchParams.get("param")

      const imageUrl = param ? `https://${NEXT_PUBLIC_HOST}/images/og/cast/${param}.png` : `https://${NEXT_PUBLIC_HOST}/images/og/cast.png`

      const parsedMiniapp = JSON.stringify({
        ...MINIAPP_METADATA,
        imageUrl,
      })
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")

      const response = `<html><head><meta charset="UTF-8"><title>${MINIAPP.title}</title><meta name="fc:miniapp" content="${parsedMiniapp}" /><meta name="description" content="${MINIAPP.description}" /></head><body></body></html>`

      return new NextResponse(response, {
        headers: { "content-type": "text/html" },
      })
    }
  }

  return NextResponse.next()
}
