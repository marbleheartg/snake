import { useReadContractGetLeaderboard, useReadContractGetPlayerStats, useReadContractGlobalBestScore } from "@/lib/abi"
import { CA } from "@/lib/constants"
import { store } from "@/lib/store"
import clsx from "clsx"
import NextImage from "next/image"
import { useMemo } from "react"
import { useAccount, useBalance } from "wagmi"

export default function Home() {
  const { address } = useAccount()
  const { user } = store()
  const { data: balance } = useBalance({ address })

  // Contract data
  const { data: playerStats } = useReadContractGetPlayerStats({
    address: CA,
    args: address ? [address] : undefined,
  })
  const { data: leaderboard } = useReadContractGetLeaderboard({ address: CA })
  const { data: globalBestScore } = useReadContractGlobalBestScore({ address: CA })

  // Calculate user rank
  const userRank = useMemo(() => {
    if (!leaderboard || !address) return null

    const sortedLeaderboard = leaderboard
      .filter(entry => entry.player !== "0x0000000000000000000000000000000000000000")
      .sort((a, b) => Number(b.score) - Number(a.score))

    const rankIndex = sortedLeaderboard.findIndex(entry => entry.player.toLowerCase() === address.toLowerCase())

    return rankIndex >= 0 ? rankIndex + 1 : null
  }, [leaderboard, address])

  const bestScore = playerStats?.[0] ? Number(playerStats[0]) : 0
  const gamesPlayed = playerStats?.[1] ? Number(playerStats[1]) : 0
  const globalRecord = globalBestScore ? Number(globalBestScore) : 0

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div
        className={clsx(
          "fixed inset-0",
          "flex flex-col",
          "bg-gradient-to-br from-white/12 via-white/8 to-white/5",
          "glass overflow-hidden",
          "backdrop-blur-3xl",
          "animate-in fade-in duration-700",
        )}
      >
        {/* Header */}
        <div className="flex justify-center items-center w-full px-6 py-8 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 flex items-center justify-center shadow-[0_4px_16px_rgba(255,255,255,0.2)]">
                <NextImage
                  src={user?.pfpUrl || "https://wrpcd.net/cdn-cgi/image/anim=false,fit=contain,f=auto,w=288/https%3A%2F%2Ffarcaster.xyz%2Favatar.png"}
                  width={56}
                  height={56}
                  alt="avatar"
                  className="rounded-full"
                />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">{user?.username || "Player"}</h1>
                <p className="text-sm text-white/60 font-mono">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-28">
          <div className="space-y-4">
            {/* Personal Stats */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white/90 uppercase tracking-[0.15em]">personal stats</h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-4 border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                  <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-2">best score</span>
                  <span className="text-3xl font-black tabular-nums bg-gradient-to-br from-emerald-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]">
                    {bestScore}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-4 border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                  <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-2">games played</span>
                  <span className="text-3xl font-black tabular-nums bg-gradient-to-br from-blue-400 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]">
                    {gamesPlayed}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-4 border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                  <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-2">current rank</span>
                  <span className="text-3xl font-black tabular-nums bg-gradient-to-br from-purple-400 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(147,51,234,0.3)]">
                    {userRank ? `#${userRank}` : "-"}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-4 border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                  <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-2">avg score</span>
                  <span className="text-3xl font-black tabular-nums bg-gradient-to-br from-orange-400 to-orange-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(251,146,60,0.3)]">
                    {gamesPlayed > 0 ? Math.round(bestScore / gamesPlayed) : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Global Comparison */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white/90 uppercase tracking-[0.15em]">global standing</h2>

              <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-4 border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-1">global record</span>
                    <span className="text-2xl font-black tabular-nums text-white drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]">{globalRecord}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-1">your progress</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${globalRecord > 0 ? Math.min((bestScore / globalRecord) * 100, 100) : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-yellow-400 tabular-nums">
                        {globalRecord > 0 ? Math.round((bestScore / globalRecord) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Info */}
            {balance && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white/90 uppercase tracking-[0.15em]">wallet</h2>

                <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-4 border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-1">balance</span>
                      <span className="text-2xl font-black tabular-nums text-white drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]">
                        {(Number(balance.value) / Math.pow(10, balance.decimals)).toFixed(4)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-white/80">{balance.symbol}</span>
                      <div className="text-xs text-white/60 mt-1">Base Network</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white/90 uppercase tracking-[0.15em]">achievements</h2>

              <div className="grid grid-cols-1 gap-3">
                <div
                  className={clsx(
                    "bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-4 border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm",
                    bestScore >= 100 && "border-emerald-400/30 bg-gradient-to-r from-emerald-500/10 to-transparent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                        bestScore >= 100 ? "bg-emerald-400/20 text-emerald-400" : "bg-white/10 text-white/40",
                      )}
                    >
                      {bestScore >= 100 ? "🏆" : "🔒"}
                    </div>
                    <div>
                      <div className="font-bold text-white">Century Club</div>
                      <div className="text-sm text-white/60">Score 100+ points in a single game</div>
                    </div>
                  </div>
                </div>

                <div
                  className={clsx(
                    "bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-4 border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm",
                    gamesPlayed >= 10 && "border-blue-400/30 bg-gradient-to-r from-blue-500/10 to-transparent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                        gamesPlayed >= 10 ? "bg-blue-400/20 text-blue-400" : "bg-white/10 text-white/40",
                      )}
                    >
                      {gamesPlayed >= 10 ? "🎮" : "🔒"}
                    </div>
                    <div>
                      <div className="font-bold text-white">Dedicated Player</div>
                      <div className="text-sm text-white/60">Play 10+ games</div>
                    </div>
                  </div>
                </div>

                <div
                  className={clsx(
                    "bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-4 border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm",
                    userRank && userRank <= 10 && "border-yellow-400/30 bg-gradient-to-r from-yellow-500/10 to-transparent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                        userRank && userRank <= 10 ? "bg-yellow-400/20 text-yellow-400" : "bg-white/10 text-white/40",
                      )}
                    >
                      {userRank && userRank <= 10 ? "⭐" : "🔒"}
                    </div>
                    <div>
                      <div className="font-bold text-white">Top 10 Elite</div>
                      <div className="text-sm text-white/60">Reach top 10 on the leaderboard</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
