import { useEffect, useRef, useState } from 'react'
import type { RoboLevel } from '../game/content'
import { sfx } from '../game/sfx'

type Cmd = 'F' | 'L' | 'R'
const CMD_ICON: Record<Cmd, string> = { F: '⬆️', L: '↶', R: '↷' }
const DIR_VEC = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
]
const DIR_ARROW = ['▲', '▶', '▼', '◀']

interface Props {
  intro: string
  levels: RoboLevel[]
  onDone: (score: number) => void
}

interface Sim {
  x: number
  y: number
  dir: number
  step: number
  status: 'running' | 'won' | 'crashed' | 'lost'
}

export default function RoboticsGame({ intro, levels, onDone }: Props) {
  const [lvlIdx, setLvlIdx] = useState(0)
  const [program, setProgram] = useState<Cmd[]>([])
  const [sim, setSim] = useState<Sim | null>(null)
  const [fails, setFails] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const level = levels[lvlIdx]
  const key = (x: number, y: number) => `${x},${y}`
  const obstacles = new Set(level.obstacles.map((o) => key(o.x, o.y)))

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])

  const add = (c: Cmd) => {
    if (sim) return
    if (program.length >= level.maxCommands) {
      sfx.bad()
      return
    }
    sfx.click()
    setProgram([...program, c])
  }

  const run = () => {
    if (program.length === 0 || sim) return
    sfx.enter()
    const start: Sim = { x: level.start.x, y: level.start.y, dir: level.start.dir, step: 0, status: 'running' }
    setSim(start)
    timer.current = setInterval(() => {
      setSim((prev) => {
        if (!prev || prev.status !== 'running') return prev
        if (prev.step >= program.length) {
          if (timer.current) clearInterval(timer.current)
          return { ...prev, status: 'lost' }
        }
        const cmd = program[prev.step]
        let { x, y, dir } = prev
        if (cmd === 'L') dir = (dir + 3) % 4
        else if (cmd === 'R') dir = (dir + 1) % 4
        else {
          x += DIR_VEC[dir].x
          y += DIR_VEC[dir].y
        }
        sfx.robot()
        if (x < 0 || y < 0 || x >= level.w || y >= level.h || obstacles.has(key(x, y))) {
          sfx.bad()
          if (timer.current) clearInterval(timer.current)
          return { x: Math.max(0, Math.min(x, level.w - 1)), y: Math.max(0, Math.min(y, level.h - 1)), dir, step: prev.step + 1, status: 'crashed' }
        }
        if (x === level.goal.x && y === level.goal.y) {
          sfx.badge()
          if (timer.current) clearInterval(timer.current)
          return { x, y, dir, step: prev.step + 1, status: 'won' }
        }
        return { x, y, dir, step: prev.step + 1, status: 'running' }
      })
    }, 320)
  }

  const reset = () => {
    if (timer.current) clearInterval(timer.current)
    if (sim && (sim.status === 'crashed' || sim.status === 'lost')) setFails((f) => f + 1)
    setSim(null)
  }

  const nextLevel = () => {
    const efficient = program.length <= Math.ceil(level.maxCommands * 0.6)
    const levelScore = Math.max(40, (efficient ? 100 : 80) - fails * 12)
    const all = [...scores, levelScore]
    setScores(all)
    setProgram([])
    setSim(null)
    setFails(0)
    if (lvlIdx === levels.length - 1) onDone(Math.round(all.reduce((a, b) => a + b, 0) / all.length))
    else setLvlIdx(lvlIdx + 1)
  }

  const rx = sim ? sim.x : level.start.x
  const ry = sim ? sim.y : level.start.y
  const rdir = sim ? sim.dir : level.start.dir

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-pixel text-[11px] text-amber-300">
          Level {lvlIdx + 1}/{levels.length}
        </h3>
        <p className="font-pixel text-[9px] text-slate-400">
          CMDS {program.length}/{level.maxCommands}
        </p>
      </div>
      <p className="mb-3 text-sm text-slate-300">{intro}</p>

      {/* grid */}
      <div className="mx-auto mb-3 w-fit rounded-lg border-2 border-slate-600 bg-slate-900 p-2">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${level.w}, 1fr)` }}>
          {Array.from({ length: level.h * level.w }).map((_, i) => {
            const x = i % level.w
            const y = Math.floor(i / level.w)
            const isRobot = rx === x && ry === y
            const isGoal = level.goal.x === x && level.goal.y === y
            const isObs = obstacles.has(key(x, y))
            return (
              <div
                key={i}
                className={`flex h-10 w-10 items-center justify-center rounded text-xl sm:h-11 sm:w-11 ${
                  isGoal ? 'bg-amber-500/30' : (x + y) % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/60'
                }`}
              >
                {isRobot ? (
                  sim?.status === 'crashed' ? (
                    '💥'
                  ) : (
                    <span className="relative inline-block">
                      🤖
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] text-sky-300">{DIR_ARROW[rdir]}</span>
                    </span>
                  )
                ) : isGoal ? (
                  '⭐'
                ) : isObs ? (
                  '🪨'
                ) : (
                  ''
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* program strip */}
      <div className="mb-3 flex min-h-12 flex-wrap items-center gap-1 rounded-lg border-2 border-dashed border-cyan-700 bg-cyan-950/40 p-2">
        {program.length === 0 && <p className="text-xs text-slate-500">Tap commands below to build the robot’s program…</p>}
        {program.map((c, i) => (
          <span
            key={i}
            className={`flex h-8 w-8 items-center justify-center rounded border text-base ${
              sim && i < sim.step ? 'border-green-400 bg-green-900/50' : sim && i === sim.step ? 'border-amber-300 bg-amber-500/40' : 'border-cyan-600 bg-cyan-900/50'
            }`}
          >
            {CMD_ICON[c]}
          </span>
        ))}
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => add('F')} disabled={!!sim} className="pix-btn bg-cyan-500 px-4 py-2 text-xs text-slate-900 disabled:opacity-40">
          ⬆️ MOVE
        </button>
        <button onClick={() => add('L')} disabled={!!sim} className="pix-btn bg-cyan-600 px-4 py-2 text-xs text-white disabled:opacity-40">
          ↶ TURN
        </button>
        <button onClick={() => add('R')} disabled={!!sim} className="pix-btn bg-cyan-600 px-4 py-2 text-xs text-white disabled:opacity-40">
          ↷ TURN
        </button>
        <button onClick={() => !sim && setProgram(program.slice(0, -1))} disabled={!!sim} className="pix-btn bg-slate-600 px-4 py-2 text-xs text-white disabled:opacity-40">
          ⌫ UNDO
        </button>
        <button onClick={() => !sim && setProgram([])} disabled={!!sim} className="pix-btn bg-slate-600 px-4 py-2 text-xs text-white disabled:opacity-40">
          ✖ CLEAR
        </button>
        {!sim && (
          <button onClick={run} className="pix-btn bg-green-500 px-6 py-2 text-[11px] text-slate-900">
            ▶ RUN
          </button>
        )}
      </div>

      {sim?.status === 'crashed' && (
        <div className="mt-3 rounded-lg border-2 border-red-600 bg-red-950/60 p-3 text-center">
          <p className="text-sm font-bold text-red-200">💥 Crash! Robots do exactly what the program says — check the order.</p>
          <button onClick={reset} className="pix-btn mt-2 bg-slate-500 px-5 py-2 text-[10px] text-white">
            ↺ EDIT PROGRAM
          </button>
        </div>
      )}
      {sim?.status === 'lost' && (
        <div className="mt-3 rounded-lg border-2 border-amber-600 bg-amber-950/60 p-3 text-center">
          <p className="text-sm font-bold text-amber-200">The robot stopped before the star. Add more commands!</p>
          <button onClick={reset} className="pix-btn mt-2 bg-slate-500 px-5 py-2 text-[10px] text-white">
            ↺ EDIT PROGRAM
          </button>
        </div>
      )}
      {sim?.status === 'won' && (
        <div className="mt-3 rounded-lg border-2 border-green-600 bg-green-950/60 p-3 text-center">
          <p className="text-sm font-bold text-green-200">⭐ Goal reached in {program.length} commands!</p>
          <button onClick={nextLevel} className="pix-btn mt-2 bg-amber-500 px-5 py-2 text-[10px] text-slate-900">
            {lvlIdx === levels.length - 1 ? 'FINISH ▸' : 'NEXT LEVEL ▸'}
          </button>
        </div>
      )}
    </div>
  )
}
