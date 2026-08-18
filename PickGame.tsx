import { useState } from 'react'
import type { PickChallenge } from '../game/types'
import { sfx } from '../game/sfx'

interface Props {
  challenge: PickChallenge
  onDone: (score: number) => void
}

export default function PickGame({ challenge, onDone }: Props) {
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [checked, setChecked] = useState(false)

  const toggle = (i: number) => {
    if (checked) return
    const next = new Set(picked)
    if (next.has(i)) {
      next.delete(i)
      sfx.click()
    } else {
      if (next.size >= challenge.slots) {
        sfx.bad()
        return
      }
      next.add(i)
      sfx.coin()
    }
    setPicked(next)
  }

  const goodPicked = [...picked].filter((i) => challenge.items[i].good).length
  const score = Math.round((goodPicked / challenge.slots) * 100)

  return (
    <div>
      <h3 className="mb-1 font-pixel text-[11px] text-amber-300">{challenge.title}</h3>
      <p className="mb-2 text-sm text-slate-300">{challenge.instruction}</p>
      <p className="mb-3 font-pixel text-[9px] text-sky-300">
        SLOTS: {picked.size}/{challenge.slots}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {challenge.items.map((it, i) => {
          const isPicked = picked.has(i)
          let cls = 'border-slate-600 bg-slate-800 hover:border-slate-400'
          if (!checked && isPicked) cls = 'border-amber-300 bg-amber-500/20 shadow-[0_0_10px_rgba(252,211,77,0.4)]'
          if (checked && isPicked && it.good) cls = 'border-green-400 bg-green-900/50'
          if (checked && isPicked && !it.good) cls = 'border-red-400 bg-red-900/50'
          if (checked && !isPicked && it.good) cls = 'border-dashed border-green-600 bg-slate-800 opacity-80'
          if (checked && !isPicked && !it.good) cls = 'border-slate-700 bg-slate-800 opacity-40'
          return (
            <button key={i} onClick={() => toggle(i)} className={`rounded-lg border-2 p-2 text-left transition-all ${cls}`}>
              <p className="text-sm font-semibold text-white">
                <span className="mr-1 text-lg">{it.icon}</span>
                {it.label}
              </p>
              {checked && (isPicked || it.good) && (
                <p className="mt-1 text-[11px] leading-tight text-slate-300">
                  {isPicked && it.good && '✅ '}
                  {isPicked && !it.good && '❌ '}
                  {!isPicked && it.good && '⚠️ missed: '}
                  {it.why}
                </p>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex justify-end">
        {!checked ? (
          <button
            disabled={picked.size !== challenge.slots}
            onClick={() => {
              setChecked(true)
              if (score >= 70) sfx.good()
              else sfx.bad()
            }}
            className="pix-btn bg-green-500 px-6 py-2 text-[10px] text-slate-900 disabled:opacity-40"
          >
            DONE ✓
          </button>
        ) : (
          <button onClick={() => onDone(score)} className="pix-btn bg-amber-500 px-6 py-2 text-[10px] text-slate-900">
            CONTINUE ▸
          </button>
        )}
      </div>
      {checked && (
        <p className="mt-2 text-center text-sm font-bold text-white">
          {goodPicked}/{challenge.slots} smart picks — {score >= 100 ? 'Perfect packing! 🌟' : score >= 70 ? 'Solid choices! 💪' : 'Check the ✅ tips and try again!'}
        </p>
      )}
    </div>
  )
}
