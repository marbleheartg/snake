import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    console.error(JSON.stringify(data))

    return new NextResponse("Reporting client error", { status: 200 })
  } catch (err) {
    console.error(err)
    return new NextResponse("Reporting client error", { status: 500 })
  }
}
