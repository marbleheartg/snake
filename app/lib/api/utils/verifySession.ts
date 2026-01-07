import { createClient } from "@farcaster/quick-auth"

const client = createClient()

export default async function verifySession(session: string): Promise<number> {
  const { NEXT_PUBLIC_HOST } = process.env
  if (!NEXT_PUBLIC_HOST) throw new Error("VerifyCredentialsNotConfigured")

  const payload = await client.verifyJwt({
    token: session,
    domain: NEXT_PUBLIC_HOST,
  })

  return payload.sub as unknown as number
}
