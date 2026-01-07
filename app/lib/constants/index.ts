const CA = "0x0B44FAf4dcDafECb1a34a6Fc30eB9B787c9149ef"

const MINIAPP = {
  title: "snake",
  description: "snake game",
  tags: ["snake", "snake", "snake", "snake", "snake"],
  primaryCategory: "games",
  webhookUrl: "https://api.neynar.com/f/app/3448f775-80b4-490f-95c8-171217b878f6/event",
  bgColor: "#334f3c",
}

const MINIAPP_METADATA = {
  version: "next",
  imageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/cast.png`,
  aspectRatio: "3:2",
  button: {
    title: "play",
    action: {
      type: "launch_miniapp",
      url: `https://${process.env.NEXT_PUBLIC_HOST}`,
      name: MINIAPP.title,
      splashImageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/splash.png`,
      splashBackgroundColor: MINIAPP.bgColor,
    },
  },
}

export { CA, MINIAPP, MINIAPP_METADATA }
