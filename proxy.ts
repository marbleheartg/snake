import verifySession from "@/lib/api/utils/verifySession"
import { MINIAPP, MINIAPP_METADATA } from "@/lib/constants"
import { NextRequest, NextResponse } from "next/server"

const { NEXT_PUBLIC_HOST } = process.env
if (!NEXT_PUBLIC_HOST) throw new Error("NextConfigCredentialsNotConfigured")

export const config = {
  matcher: ["/api/:path*", "/og"],
}

const protectedRoutes = ["/api/neynar"]

export async function proxy(request: NextRequest) {
  const headers = request.headers

  if (headers.get("x-middleware-subrequest")) return NextResponse.json({ error: "Forbidden header detected" }, { status: 403 })
  if (!headers.get("origin")?.endsWith(NEXT_PUBLIC_HOST!)) return new Response("Forbidden", { status: 403 })

  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api")) {
    if (!protectedRoutes.some(route => pathname.startsWith(route))) return NextResponse.next()

    const authHeader = headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 })

    const session = authHeader.split(" ")[1]

    const fid = await verifySession(session)

    const newHeaders = new Headers(headers)
    newHeaders.set("fid", fid.toString())

    return NextResponse.next({
      request: {
        headers: newHeaders,
      },
    })
  }

  if (pathname.startsWith("/og")) {
    const userAgent = headers.get("user-agent")?.toLowerCase() || ""

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
