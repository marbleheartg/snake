export interface User {
  object: string
  fid: number
  username: string
  display_name: string
  pfp_url: string
  custody_address: string
  pro: Pro
  profile: Profile
  follower_count: number
  following_count: number
  verifications: string[]
  verified_addresses: VerifiedAddresses
  auth_addresses: AuthAddress[]
  verified_accounts: VerifiedAccount[]
  url: string
  experimental: Experimental
  score: number
}

export interface Pro {
  status: string
  subscribed_at: string
  expires_at: string
}

export interface Profile {
  bio: Bio
  banner: Banner
}

export interface Bio {
  text: string
}

export interface Banner {
  url: string
}

export interface VerifiedAddresses {
  eth_addresses: string[]
  sol_addresses: string[]
  primary: Primary
}

export interface Primary {
  eth_address: string
  sol_address: string
}

export interface AuthAddress {
  address: string
  app: App
}

export interface App {
  object: string
  fid: number
}

export interface VerifiedAccount {
  platform: string
  username: string
}

export interface Experimental {
  neynar_user_score: number
  deprecation_notice: string
}
