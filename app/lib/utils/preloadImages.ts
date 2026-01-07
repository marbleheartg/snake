export default function preloadImages(srcs: string[]): Promise<PromiseSettledResult<void>[]> {
  return Promise.allSettled(
    srcs.map(src => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        let done = false

        const finalize = (fn: () => void) => {
          if (done) return
          done = true
          clearTimeout(timer)
          fn()
        }

        const timer = setTimeout(() => {
          finalize(resolve)
        }, 2000)

        img.onload = () => finalize(resolve)
        img.onerror = () => finalize(() => reject(new Error(`Failed to load image: ${src}`)))

        img.src = src
      })
    }),
  )
}
