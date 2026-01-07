import {
  useReadContractGetLeaderboard,
  useReadContractGetPlayerStats,
  useReadContractGlobalBestScore,
  useReadContractPlayFee,
  useWriteContractSubmitScore,
} from "@/lib/abi"
import { CA } from "@/lib/constants"
import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { base } from "viem/chains"
import { useAccount, useBalance, useConnect, useConnectors, useSwitchChain } from "wagmi"
import { store } from "../../lib/store"

// Game constants
const GRID_SIZE = 20
const INITIAL_SPEED = 150
const SPEED_INCREASE = 5
const MIN_SPEED = 60

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
type Position = { x: number; y: number }
type GameState = "idle" | "playing" | "paused" | "gameover"

export default function Game() {
  const { address } = useAccount()
  const { capabilities } = store()

  // Canvas ref and game state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 })
  const [gameState, setGameState] = useState<GameState>("idle")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // Game refs for game loop
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }])
  const directionRef = useRef<Direction>("RIGHT")
  const nextDirectionRef = useRef<Direction>("RIGHT")
  const foodRef = useRef<Position>({ x: 15, y: 10 })
  const speedRef = useRef(INITIAL_SPEED)
  const gameLoopRef = useRef<number | null>(null)
  const scoreRef = useRef(0)

  // Touch handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  // Contract hooks
  const { data: playFee } = useReadContractPlayFee({ address: CA })
  const { data: globalBestScore } = useReadContractGlobalBestScore({ address: CA })
  const { data: playerStats, refetch: refetchPlayerStats } = useReadContractGetPlayerStats({
    address: CA,
    args: address ? [address] : undefined,
  })
  const { data: leaderboard, refetch: refetchLeaderboard } = useReadContractGetLeaderboard({ address: CA })
  const { writeContract: submitScore, isPending: isSubmitting } = useWriteContractSubmitScore()
  const { data: balance } = useBalance({ address })

  // Initialize high score from contract
  useEffect(() => {
    if (playerStats?.[0]) {
      setHighScore(Number(playerStats[0]))
    }
  }, [playerStats])

  // Calculate canvas size based on container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const size = Math.min(rect.width - 32, rect.height - 180)
        const gridAlignedSize = Math.floor(size / GRID_SIZE) * GRID_SIZE
        setCanvasSize({ width: gridAlignedSize, height: gridAlignedSize })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Generate random food position (avoiding borders)
  const generateFood = useCallback((): Position => {
    let newFood: Position
    let attempts = 0
    const maxAttempts = 100 // Prevent infinite loops
    const borderPadding = 2 // Keep food away from edges

    do {
      newFood = {
        x: Math.floor(Math.random() * (GRID_SIZE - borderPadding * 2)) + borderPadding,
        y: Math.floor(Math.random() * (GRID_SIZE - borderPadding * 2)) + borderPadding,
      }
      attempts++
    } while (attempts < maxAttempts && snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y))

    // If we couldn't find a spot after max attempts, place it anywhere (shouldn't happen with reasonable snake size)
    return newFood
  }, [])

  // Draw game on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    const cellSize = canvasSize.width / GRID_SIZE

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "rgba(51, 79, 60, 0.4)")
    gradient.addColorStop(1, "rgba(30, 50, 40, 0.3)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid pattern with subtle glow
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvas.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvas.width, i * cellSize)
      ctx.stroke()
    }

    // Draw food with enhanced glow effect
    const food = foodRef.current
    const foodX = food.x * cellSize + cellSize / 2
    const foodY = food.y * cellSize + cellSize / 2
    const foodRadius = cellSize / 2.5

    // Outer glow
    ctx.shadowColor = "#ff6b6b"
    ctx.shadowBlur = 20
    ctx.fillStyle = "#ff6b6b"
    ctx.beginPath()
    ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2)
    ctx.fill()

    // Inner highlight
    ctx.shadowBlur = 0
    const foodGradient = ctx.createRadialGradient(foodX - foodRadius * 0.3, foodY - foodRadius * 0.3, 0, foodX, foodY, foodRadius)
    foodGradient.addColorStop(0, "#ff8787")
    foodGradient.addColorStop(1, "#ff6b6b")
    ctx.fillStyle = foodGradient
    ctx.beginPath()
    ctx.arc(foodX, foodY, foodRadius * 0.9, 0, Math.PI * 2)
    ctx.fill()

    // Draw snake with enhanced visuals
    const snake = snakeRef.current
    snake.forEach((segment, index) => {
      const isHead = index === 0
      const alpha = Math.max(0.5, 1 - index * 0.025)
      const segmentX = segment.x * cellSize + cellSize / 2
      const segmentY = segment.y * cellSize + cellSize / 2
      const segmentSize = cellSize - (isHead ? 2 : 4)
      const radius = isHead ? 7 : 5

      if (isHead) {
        // Head with enhanced glow
        ctx.shadowColor = "#a8e6a1"
        ctx.shadowBlur = 16
        const headGradient = ctx.createRadialGradient(
          segmentX - segmentSize * 0.2,
          segmentY - segmentSize * 0.2,
          0,
          segmentX,
          segmentY,
          segmentSize / 2,
        )
        headGradient.addColorStop(0, "#c4f5c0")
        headGradient.addColorStop(1, "#a8e6a1")
        ctx.fillStyle = headGradient
      } else {
        ctx.shadowBlur = 0
        ctx.fillStyle = `rgba(168, 230, 161, ${alpha})`
      }

      ctx.beginPath()
      ctx.roundRect(segmentX - segmentSize / 2, segmentY - segmentSize / 2, segmentSize, segmentSize, radius)
      ctx.fill()
    })
    ctx.shadowBlur = 0
  }, [canvasSize])

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return

    const snake = snakeRef.current
    directionRef.current = nextDirectionRef.current
    const direction = directionRef.current
    const head = { ...snake[0] }
    const maxPos = GRID_SIZE

    // Move head
    switch (direction) {
      case "UP":
        head.y -= 1
        break
      case "DOWN":
        head.y += 1
        break
      case "LEFT":
        head.x -= 1
        break
      case "RIGHT":
        head.x += 1
        break
    }

    // Check wall collision
    if (head.x < 0 || head.x >= maxPos || head.y < 0 || head.y >= maxPos) {
      endGame()
      return
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      endGame()
      return
    }

    // Add new head
    snakeRef.current = [head, ...snake]

    // Check food collision
    const food = foodRef.current
    if (head.x === food.x && head.y === food.y) {
      scoreRef.current += 10
      setScore(scoreRef.current)
      foodRef.current = generateFood()
      // Increase speed
      speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREASE)
      // Haptic feedback
      if (capabilities?.includes("haptics.impactOccurred")) {
        sdk.haptics.impactOccurred("light")
      }
    } else {
      snakeRef.current.pop()
    }

    draw()

    gameLoopRef.current = window.setTimeout(gameLoop, speedRef.current)
  }, [gameState, canvasSize, generateFood, draw, capabilities])

  // Start game loop
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = window.setTimeout(gameLoop, speedRef.current)
    }
    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current)
      }
    }
  }, [gameState, gameLoop])

  // End game
  const endGame = useCallback(() => {
    setGameState("gameover")
    if (gameLoopRef.current) {
      clearTimeout(gameLoopRef.current)
    }
    if (capabilities?.includes("haptics.notificationOccurred")) {
      sdk.haptics.notificationOccurred("error")
    }
    const finalScore = scoreRef.current
    if (finalScore > highScore) {
      setHighScore(finalScore)
    }
  }, [highScore, capabilities])

  // Start new game
  const startGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }]
    directionRef.current = "RIGHT"
    nextDirectionRef.current = "RIGHT"
    foodRef.current = generateFood()
    speedRef.current = INITIAL_SPEED
    scoreRef.current = 0
    setScore(0)
    setGameState("playing")
    if (capabilities?.includes("haptics.impactOccurred")) {
      sdk.haptics.impactOccurred("medium")
    }
  }, [generateFood, capabilities])

  // Handle direction change
  const changeDirection = useCallback((newDirection: Direction) => {
    const current = directionRef.current
    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    }
    if (newDirection !== opposites[current]) {
      nextDirectionRef.current = newDirection
    }
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === "idle" || gameState === "gameover") {
        if (e.code === "Space" || e.code === "Enter") {
          startGame()
        }
        return
      }
      if (gameState !== "playing") return

      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          changeDirection("UP")
          break
        case "ArrowDown":
        case "KeyS":
          changeDirection("DOWN")
          break
        case "ArrowLeft":
        case "KeyA":
          changeDirection("LEFT")
          break
        case "ArrowRight":
        case "KeyD":
          changeDirection("RIGHT")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState, startGame, changeDirection])

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const minSwipe = 30

    if (Math.abs(deltaX) < minSwipe && Math.abs(deltaY) < minSwipe) {
      // Tap - start game if not playing
      if (gameState === "idle" || gameState === "gameover") {
        startGame()
      }
      return
    }

    if (gameState !== "playing") return

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      changeDirection(deltaX > 0 ? "RIGHT" : "LEFT")
    } else {
      changeDirection(deltaY > 0 ? "DOWN" : "UP")
    }

    touchStartRef.current = null
  }

  const { mutate: connect } = useConnect()
  const connectors = useConnectors()
  const { mutate: switchChain } = useSwitchChain()
  const session = store.getState().session

  // Submit score to contract
  const handleSubmitScore = async () => {
    if (!address || scoreRef.current === 0) return

    try {
      try {
        connect({ connector: connectors[0] })
      } catch {}
      try {
        switchChain({ chainId: base.id })
      } catch {}

      submitScore(
        {
          address: CA,
          args: [BigInt(scoreRef.current)],
          value: playFee || BigInt(0),
        },
        {
          onSuccess: () => {
            if (capabilities?.includes("haptics.notificationOccurred")) {
              sdk.haptics.notificationOccurred("success")
            }
            refetchPlayerStats()
            refetchLeaderboard()
          },
        },
      )
    } catch (err) {
      console.error("Failed to submit score:", err)
    }
  }

  // Initial draw
  useEffect(() => {
    draw()
  }, [draw, canvasSize])

  const formattedLeaderboard = useMemo(() => {
    if (!leaderboard) return []

    // Filter out zero addresses, deduplicate by player (keep highest score), and sort
    const filtered = leaderboard.filter(entry => entry.player !== "0x0000000000000000000000000000000000000000")

    // Deduplicate by player address, keeping the highest score for each player
    const deduplicated = filtered.reduce(
      (acc, entry) => {
        const existingIndex = acc.findIndex(e => e.player.toLowerCase() === entry.player.toLowerCase())
        if (existingIndex === -1) {
          // New player, add them
          acc.push(entry)
        } else if (Number(entry.score) > Number(acc[existingIndex].score)) {
          // Higher score, replace existing entry
          acc[existingIndex] = entry
        }
        return acc
      },
      [] as typeof filtered,
    )

    return deduplicated.sort((a, b) => Number(b.score) - Number(a.score))
  }, [leaderboard])

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div
        ref={containerRef}
        className={clsx(
          "fixed inset-0 pb-2",
          "flex flex-col gap-4.5",
          "bg-gradient-to-br from-white/12 via-white/8 to-white/5",
          "glass overflow-hidden",
          "backdrop-blur-3xl",
          "animate-in fade-in duration-700",
        )}
      >
        {/* Score header */}
        <div className="flex justify-between items-center w-full px-6 py-5 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold mb-1">your score</span>
            <span className="text-4xl font-black tabular-nums bg-gradient-to-br from-white via-white/95 to-white/80 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
              {score}
            </span>
          </div>
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent mx-4"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold mb-1">your best</span>
            <span className="text-4xl font-black tabular-nums bg-gradient-to-br from-emerald-400 via-emerald-300 to-green-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]">
              {highScore}
            </span>
          </div>
        </div>
        {/* Game canvas */}
        <div className="flex items-center justify-center min-h-0">
          <div
            className={clsx(
              "relative rounded-3xl overflow-hidden mx-auto",
              "border-2 border-white/30",
              "bg-gradient-to-br from-black/30 via-black/25 to-black/30",
              "shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.3)]",
              "backdrop-blur-md",
              "ring-1 ring-white/10",
            )}
            style={{ width: canvasSize.width, height: canvasSize.height }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} className="block" />

            {/* Overlay for idle/gameover states */}
            {(gameState === "idle" || gameState === "gameover") && (
              <div
                className={clsx(
                  "absolute inset-0 flex flex-col items-center justify-center gap-6",
                  "bg-gradient-to-br from-black/85 via-black/75 to-black/85",
                  "backdrop-blur-xl",
                  "border border-white/15",
                  "animate-in fade-in duration-300",
                )}
              >
                {gameState === "gameover" && (
                  <div className="text-center space-y-6 w-full px-6 animate-in zoom-in-95 duration-300">
                    <div className="space-y-4">
                      <h2 className="text-3xl font-black text-red-400 uppercase tracking-[0.2em] drop-shadow-[0_4px_12px_rgba(248,113,113,0.5)]">
                        game over
                      </h2>
                      <div className="bg-gradient-to-br from-black/60 to-black/40 rounded-2xl px-6 py-4 border border-white/25 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                        <p className="text-xs opacity-80 uppercase tracking-[0.15em] mb-2 font-semibold">final score</p>
                        <p className="text-4xl font-black tabular-nums text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">{score}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {address && score > 0 && (
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            handleSubmitScore()
                          }}
                          onTouchStart={e => e.stopPropagation()}
                          onTouchEnd={e => e.stopPropagation()}
                          disabled={isSubmitting}
                          className={clsx(
                            "w-full px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.1em]",
                            "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500",
                            "border border-emerald-300/60",
                            "shadow-[0_4px_16px_rgba(16,185,129,0.4)]",
                            "hover:shadow-[0_6px_24px_rgba(16,185,129,0.6)] hover:scale-[1.02] hover:brightness-110",
                            "active:scale-[0.98] active:brightness-95",
                            "transition-all duration-200",
                            "text-white",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100",
                          )}
                        >
                          {isSubmitting ? "submitting..." : "submit score"}
                        </button>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          startGame()
                        }}
                        onTouchStart={e => e.stopPropagation()}
                        onTouchEnd={e => e.stopPropagation()}
                        className={clsx(
                          "w-full px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.1em]",
                          "bg-gradient-to-r from-white/15 to-white/10",
                          "border border-white/30",
                          "shadow-[0_4px_16px_rgba(255,255,255,0.1)]",
                          "hover:bg-white/20 hover:shadow-[0_6px_24px_rgba(255,255,255,0.15)] hover:scale-[1.02]",
                          "active:scale-[0.98]",
                          "transition-all duration-200",
                          "text-white",
                        )}
                      >
                        play again
                      </button>
                    </div>
                  </div>
                )}

                {gameState === "idle" && (
                  <div className="text-center space-y-5 animate-in zoom-in-95 duration-300">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        startGame()
                      }}
                      onTouchStart={e => e.stopPropagation()}
                      onTouchEnd={e => e.stopPropagation()}
                      className={clsx(
                        "px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-[0.15em]",
                        "bg-gradient-to-r from-white/25 via-white/20 to-white/25",
                        "border-2 border-white/40",
                        "shadow-[0_8px_32px_rgba(255,255,255,0.2)]",
                        "hover:shadow-[0_12px_48px_rgba(255,255,255,0.3)] hover:bg-white/30 hover:scale-105 hover:brightness-110",
                        "active:scale-95 active:brightness-95",
                        "transition-all duration-300",
                        "text-white",
                        "drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]",
                      )}
                    >
                      play
                    </button>
                    <p className="text-xs opacity-70 uppercase tracking-[0.2em] font-medium">swipe or use arrow keys</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Global stats */}
        <div className="flex flex-1 pb-20 justify-center items-center">
          <div className="flex justify-center gap-3 px-6 pb-4 pt-2">
            <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-3.5 border border-white/15 text-center min-w-[90px] shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-1.5">record</span>
              <span className="text-2xl font-black tabular-nums bg-gradient-to-br from-emerald-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]">
                {globalBestScore?.toString() || "0"}
              </span>
            </div>
            {playerStats && (
              <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-3.5 border border-white/15 text-center min-w-[90px] shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-1.5">games</span>
                <span className="text-2xl font-black tabular-nums bg-gradient-to-br from-blue-400 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]">
                  {playerStats[1]?.toString() || "0"}
                </span>
              </div>
            )}
            {balance && (
              <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-2xl px-5 py-3.5 border border-white/15 text-center min-w-[90px] shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                <span className="text-[10px] opacity-70 uppercase tracking-[0.15em] font-semibold block mb-1.5">{balance.symbol}</span>
                <span className="text-2xl font-black tabular-nums bg-gradient-to-br from-yellow-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(250,204,21,0.3)]">
                  {(Number(balance.value) / Math.pow(10, balance.decimals)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
