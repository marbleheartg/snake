import clientErrorHandling from "@/lib/clientErrorsReporting"
import Providers from "@/lib/providers"
import { updateStore } from "@/lib/store"
import preloadImages from "@/lib/utils/preloadImages"
import sdk from "@farcaster/miniapp-sdk"
import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import Background from "./components/Background"
import Header from "./components/Header"
import Menu from "./components/Menu"
import Claim from "./pages/Claim"
import Home from "./pages/Home"
import Promote from "./pages/Promote"

const pngImgSrcs: string[] = []
const svgImgSrcs: string[] = []

export default function App() {
  useEffect(() => {
    clientErrorHandling()
    ;(async function () {
      try {
        const { user, client } = await sdk.context
        const capabilities = await sdk.getCapabilities()
        updateStore({ user, client, capabilities })
      } catch {}

      try {
        await preloadImages([...pngImgSrcs.map(src => `${src}.png`), ...svgImgSrcs.map(src => `${src}.svg`)].map(src => `/images/${src}`))
      } catch {
      } finally {
        await sdk.actions.ready({ disableNativeGestures: true }).catch(() => {})
      }

      try {
        const { token: session } = await sdk.quickAuth.getToken()
        updateStore({ session })
      } catch {}
    })()
  }, [])

  return (
    <div onDragStart={e => e.preventDefault()}>
      <Providers>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Claim />} />
            <Route path="/promote" element={<Promote />} />
            <Route path="/home" element={<Home />} />
          </Routes>
          <Menu />
          <Background />
        </BrowserRouter>
      </Providers>
    </div>
  )
}
