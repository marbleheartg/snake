import { User } from "@/lib/api/types"
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, ctx: { params: Promise<{ username: string }> }) {
  const { username } = await ctx.params

  try {
    const {
      data: { user },
    } = await axios.get<{
      user: User
    }>("https://api.neynar.com/v2/farcaster/user/by_username", {
      params: { username },
      headers: { "x-api-key": process.env.NEYNAR_API_KEY },
    })

    return NextResponse.json(user)
  } catch (err) {
    if (axios.isAxiosError(err))
      if (err.response?.status === 404) {
        return NextResponse.json(
          {
            error: "user_not_found",
            message: `User '${username}' not found`,
          },
          { status: 404 },
        )
      }

    console.error(err)
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Failed to fetch the user",
      },
      { status: 500 },
    )
  }
}
