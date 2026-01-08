import { NextRequest } from "next/server"

const NEYNAR_BASE = "https://api.neynar.com"

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const url = new URL(req.url)
  const { path } = await context.params
  const target = `${NEYNAR_BASE}/${path.join("/")}${url.search}`

  const res = await fetch(target, { headers: { "x-api-key": process.env.NEYNAR_API_KEY! } })

  const headers = new Headers()
  headers.set("content-type", res.headers.get("content-type") ?? "application/json")

  return new Response(res.body, { status: res.status, headers })
}
