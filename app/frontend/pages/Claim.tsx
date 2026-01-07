import clsx from "clsx"
import { useConnection } from "wagmi"

export default function Claim() {
  const { address: userAddress } = useConnection()

  return (
    <main>
      <div
        className={clsx(
          "fixed top-30 bottom-30 inset-x-1/12 px-1 pt-3.5 pb-3 z-30",
          "flex flex-col items-center",
          "bg-white/10 glass text-(--accent) rounded-4xl",
        )}
      >
        <h1>Claim</h1>
      </div>
      {/* {process.env.NODE_ENV === "development" && (
        <pre className={clsx("fixed bottom-0 inset-x-0 p-5 pb-15 rounded-t-4xl", "text-xs text-wrap bg-amber-200/50 pointer-events-none z-50")}>
          <div>{JSON.stringify({ userAddress, isLoading, ua: navigator.userAgent }, null, 2)}</div>
        </pre>
      )} */}
    </main>
  )
}
