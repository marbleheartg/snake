import { useReadContractGetLeaderboard, useReadContractGlobalBestScore } from "@/lib/abi"
import { CA } from "@/lib/constants"
import clsx from "clsx"
import { useMemo } from "react"

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useReadContractGetLeaderboard({ address: CA })
  const { data: globalBestScore } = useReadContractGlobalBestScore({ address: CA })

  const formattedLeaderboard = useMemo(() => {
    if (!leaderboard) return []

    // Filter out zero addresses, zero scores, and invalid entries
    const zeroAddress = "0x0000000000000000000000000000000000000000"
    return leaderboard
      .filter(entry => entry && entry.player && entry.player.toLowerCase() !== zeroAddress.toLowerCase() && Number(entry.score) > 0)
      .sort((a, b) => Number(b.score) - Number(a.score))
  }, [leaderboard])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🏆"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `#${rank}`
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400 drop-shadow-[0_2px_8px_rgba(250,204,21,0.6)]"
      case 2:
        return "text-gray-300 drop-shadow-[0_2px_8px_rgba(209,213,219,0.4)]"
      case 3:
        return "text-orange-400 drop-shadow-[0_2px_8px_rgba(251,146,60,0.6)]"
      default:
        return "text-white/70"
    }
  }

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
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] mb-2">
              leaderboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-1">global record</span>
                <span className="text-xl font-black tabular-nums bg-gradient-to-br from-emerald-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]">
                  {globalBestScore?.toString() || "0"}
                </span>
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
              <div className="text-center">
                <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-1">total players</span>
                <span className="text-xl font-black tabular-nums bg-gradient-to-br from-blue-400 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]">
                  {formattedLeaderboard.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard content */}
        <div className="flex-1 overflow-hidden px-2 pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
                <p className="text-white/60 uppercase tracking-[0.15em] text-sm font-medium">loading leaderboard...</p>
              </div>
            </div>
          ) : formattedLeaderboard.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-white/60 uppercase tracking-[0.15em] text-sm font-medium mb-2">no scores yet</p>
                <p className="text-white/40 text-xs">be the first to set a record!</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <div className="space-y-3">
                {formattedLeaderboard.map((entry, i) => {
                  const rank = i + 1
                  const isTopThree = rank <= 3

                  return (
                    <div
                      key={`${entry.player}-${entry.score}-${i}`}
                      className={clsx(
                        "relative rounded-2xl border backdrop-blur-sm transition-all duration-300",
                        " from-white/8 to-white/5",
                        "border-white/15",
                        "shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
                        isTopThree && "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                        "hover:shadow-[0_6px_24px_rgba(0,0,0,0.3)] hover:scale-[1.02]",
                        "p-5",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className={clsx("text-lg font-black tabular-nums", getRankColor(rank))}>{getRankIcon(rank)}</span>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 border border-white/20 flex items-center justify-center">
                              <span className="text-xs font-bold text-white/80">{entry.player.slice(2, 4).toUpperCase()}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-mono text-sm text-white/90 font-medium mb-0.5">
                              {entry.player.slice(0, 8)}...{entry.player.slice(-6)}
                            </div>
                            {isTopThree && <div className="text-xs text-white/60 uppercase tracking-[0.1em] font-semibold">top {rank} player</div>}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-3xl font-black tabular-nums text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
                            {entry.score.toString()}
                          </div>
                          <div className="text-xs text-white/50 uppercase tracking-[0.15em] font-semibold">points</div>
                        </div>
                      </div>

                      {/* Special styling for top 3 */}
                      {isTopThree && (
                        <div
                          className={clsx(
                            "absolute inset-0 rounded-2xl border-2 pointer-events-none",
                            rank === 1 && "border-yellow-400/30 bg-gradient-to-r from-yellow-500/5 to-transparent",
                            rank === 2 && "border-gray-300/30 bg-gradient-to-r from-gray-300/5 to-transparent",
                            rank === 3 && "border-orange-400/30 bg-gradient-to-r from-orange-500/5 to-transparent",
                          )}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
