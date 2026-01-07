import { store } from "@/lib/store"
import axios from "axios"

const axiosAuth = axios.create()

axiosAuth.interceptors.request.use(config => {
  const session = store.getState().session

  if (session) config.headers.Authorization = `Bearer ${session}`

  return config
})

export default axiosAuth
