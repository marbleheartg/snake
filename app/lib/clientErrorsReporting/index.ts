import axios from "axios"

export default function clientErrorHandling() {
  function reportClientError(params: any) {
    axios.post("/api/clientError", params)
  }

  window.onerror = (message, source, lineno, colno, error) =>
    reportClientError({
      type: "js-error",
      ua: navigator.userAgent,
      message,
      source,
      lineno,
      colno,
      stack: error?.stack,
    })

  window.addEventListener(
    "error",
    function (event) {
      const target = event.target as HTMLElement

      if (event instanceof ErrorEvent) {
        reportClientError({
          type: "runtime-error",
          ua: navigator.userAgent,
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        })
      } else {
        if (["IMG", "LINK"].includes(target.tagName)) return

        reportClientError({
          type: "resource-error",
          ua: navigator.userAgent,
          tagName: target.tagName,
          src: (target as HTMLImageElement).src || (target as HTMLLinkElement).href || undefined,
          outerHTML: target.outerHTML?.slice(0, 300),
        })
      }
    },
    true,
  )

  window.addEventListener("unhandledrejection", function (event) {
    const reason = event.reason

    reportClientError({
      type: "unhandledrejection",
      ua: navigator.userAgent,
      message: reason?.message || String(reason),
      stack: reason?.stack || null,
    })
  })
}
