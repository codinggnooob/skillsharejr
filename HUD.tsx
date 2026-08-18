import type { AgeGroup, Progress } from '../game/types'
import { AGE_LABELS } from '../game/types'
import { ZONES } from '../game/zones'
import { setMuted, sfx } from '../game/sfx'
import { useState } from 'react'

interface Props {
  progress: Progress
  onReset: () => void
  onSetAge: (a: AgeGroup) => void
}

export default function HUD({ progress, onReset, onSetAge }: Props) {
  const [muted, setM] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const level = Math.floor(progress.xp / 150) + 1
  const xpIn = progress.xp % 150
  const allGold = ZONES.every((z) => progress.badges[z.id] === 'gold')
  const badgeCount = ZONES.filter((z) => progress.badges[z.id]).length

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-2">
        {/* left: player card */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border-2 border-slate-600 bg-slate-900/90 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 font-pixel text-sm text-white">
            {progress.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              {progress.name} <span className="text-[10px] font-normal text-slate-400">· {AGE_LABELS[progress.ageGroup]}</span>
            </p>
            <div className="mt-1 flex items-center gap-1">
              <span className="font-pixel text-[8px] text-amber-300">LV{level}</span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-700 sm:w-32">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all" style={{ width: `${(xpIn / 150) * 100}%` }} />
              </div>
              <span className="text-[10px] text-slate-400">{progress.xp} XP</span>
            </div>
          </div>
        </div>

        {/* center: coins + beacon */}
        <div className="pointer-events-auto flex flex-col items-center gap-1">
          <div className="rounded-lg border-2 border-amber-600 bg-slate-900/90 px-3 py-2 text-center">
            <p className="font-pixel text-[11px] text-amber-300">🪙 {progress.coins}</p>
            {allGold && <p className="font-pixel text-[8px] text-yellow-200">👑 MASTER!</p>}
          </div>
          <div className="rounded-lg border-2 border-sky-700 bg-slate-900/90 px-3 py-1 text-center">
            <p className="font-pixel text-[8px] text-sky-300">🔆 BEACON {badgeCount}/9</p>
          </div>
        </div>

        {/* right: buttons */}
        <div className="pointer-events-auto flex gap-1">
          <button
            onClick={() => setShowHelp(true)}
            className="h-9 w-9 rounded-lg border-2 border-slate-600 bg-slate-900/90 text-sm text-white hover:bg-slate-700"
            title="How to play"
          >
            ❓
          </button>
          <button
            onClick={() => {
              setM(!muted)
              setMuted(!muted)
            }}
            className="h-9 w-9 rounded-lg border-2 border-slate-600 bg-slate-900/90 text-sm text-white hover:bg-slate-700"
            title="Sound on/off"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button onClick={onReset} className="h-9 w-9 rounded-lg border-2 border-slate-600 bg-slate-900/90 text-sm text-white hover:bg-slate-700" title="New game">
            🔄
          </button>
        </div>
      </div>

      {/* badges bar */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2">
        <div className="pointer-events-auto flex gap-1 rounded-lg border-2 border-slate-600 bg-slate-900/90 px-2 py-1.5">
          {ZONES.map((z) => {
            const b = progress.badges[z.id]
            const color = b === 'gold' ? '#ffd54f' : b === 'silver' ? '#c0c8d0' : b === 'bronze' ? '#cd7f32' : '#475569'
            return (
              <div
                key={z.id}
                title={`${z.name} — ${b ? b.toUpperCase() : 'no badge yet'}`}
                className="flex h-8 w-8 items-center justify-center rounded border text-base"
                style={{ borderColor: color, background: b ? `${color}22` : 'transparent', filter: b ? 'none' : 'grayscale(1) opacity(0.5)' }}
              >
                {z.icon}
              </div>
            )
          })}
        </div>
      </div>

      {showHelp && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-4" onClick={() => setShowHelp(false)}>
          <div className="pix-panel w-full max-w-md border-sky-500 bg-slate-900 p-5" onClick={(e) => e.stopPropagation()}>
            <p className="mb-3 font-pixel text-[11px] text-sky-300">❓ HOW TO PLAY</p>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>🚶 Move with <b>WASD</b> / <b>arrow keys</b> or the on-screen pad.</li>
              <li>🏛️ Walk to a glowing academy door and press <b>E</b> to go inside.</li>
              <li>💬 Walk up to the master inside and press <b>E</b> to talk — they'll give you the challenge.</li>
              <li>🏅 Score 50%+ bronze, 70%+ silver, 90%+ gold. Earn all 9 badges to relight the Skill Beacon!</li>
              <li>🚪 Step on the green exit mat to leave a building.</li>
              <li>🎩 Mayor Ada and the townsfolk share tips — walk close to hear them.</li>
            </ul>
            <p className="mb-2 mt-4 font-pixel text-[9px] text-slate-400">DIFFICULTY BAND</p>
            <div className="grid grid-cols-3 gap-1">
              {(Object.keys(AGE_LABELS) as AgeGroup[]).map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    sfx.click()
                    onSetAge(a)
                  }}
                  className={`rounded-lg border-2 px-2 py-2 text-[10px] font-bold ${
                    progress.ageGroup === a ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {AGE_LABELS[a]}
                </button>
              ))}
            </div>
            <button onClick={() => setShowHelp(false)} className="pix-btn mt-4 w-full bg-sky-500 px-4 py-2 text-[10px] text-slate-900">
              GOT IT!
            </button>
          </div>
        </div>
      )}
    </>
  )
}
