import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

// async function loadGoogleFont(font: string, text: string) {
//   const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
//   const css = await (await fetch(url)).text()
//   const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

//   if (resource) {
//     const response = await fetch(resource[1])
//     if (response.status == 200) {
//       return await response.arrayBuffer()
//     }
//   }

//   throw new Error("failed to load font data")
// }

const offsets = {
  daisy: {
    top: "0",
    right: "19%",
  },
  lily: {
    top: "0",
    right: "10%",
  },
  rose: {
    top: "8%",
    right: "10%",
  },
  sunflower: {
    top: "0",
    right: "17%",
  },
  tulip: {
    top: "5%",
    right: "18%",
  },
}

export async function GET(req: NextRequest) {
  const { NEXT_PUBLIC_HOST } = process.env
  if (!NEXT_PUBLIC_HOST) throw new Error("OGCredentialsNotConfigured")

  const { searchParams } = new URL(req.url)

  const flower = searchParams.get("flower") as keyof typeof offsets

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          // alignItems: "center",

          width: "100%",
          height: "100%",
          padding: "30px 100px",

          background: "white",
          backgroundImage: `url("https://${NEXT_PUBLIC_HOST}/manifest/ogImage.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "400px",
            position: "absolute",
            top: "-4%",
            left: "21%",
          }}
        >
          <img style={{}} height={400} src={`https://${NEXT_PUBLIC_HOST}/manifest/table.svg`} />
        </div>

        <div
          style={{
            display: "flex",
            height: "800px",
            position: "absolute",
            ...offsets[flower],
          }}
        >
          <img style={{ transform: "rotate(20deg)" }} height={800} src={`https://${NEXT_PUBLIC_HOST}/images/flowers/${flower}.png`} />
        </div>

        {/* <div
          style={{
            position: "absolute",
            left: "24%",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            width: "435px",
            height: "100px",

            background: "white",
            fontSize: username.length > 12 ? 44 : 52,
            color: "#733DA2",
          }}
        >
          {"@" + username}
        </div> */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // fonts: [
      //   {
      //     name: "Mogra",
      //     data: await loadGoogleFont("Mogra", `@${username}`),
      //     style: "normal",
      //   },
      // ],
    },
  )
}
