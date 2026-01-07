import { Inter } from "next/font/google"
import { ReactNode } from "react"
import "./globals.css"
import { MINIAPP, MINIAPP_METADATA } from "./lib/constants"

const mainFont = Inter({
  variable: "--mainFont",
  weight: "variable",
  subsets: ["latin"],
})

const titleFont = Inter({
  variable: "--titleFont",
  weight: "variable",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        <link rel="icon" type="image/png" sizes="256x256" href="/images/og/icon.png" />
        <meta name="fc:miniapp" content={JSON.stringify(MINIAPP_METADATA)} />
        <meta name="description" content={MINIAPP.description} />
        <title>{MINIAPP.title}</title>
      </head>
      <body className={`${mainFont.variable} ${titleFont.variable} antialiased`}>{children}</body>
    </html>
  )
}
