import { store } from "@/lib/store"
import axios from "axios"

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(config => {
  const session = store.getState().session

  if (session) config.headers.Authorization = `Bearer ${session}`

  return config
})

export default axiosInstance
