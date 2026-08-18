import { useState } from 'react'
import type { SortChallenge } from '../game/types'
import { sfx } from '../game/sfx'

interface Props {
  challenge: SortChallenge
  onDone: (score: number) => void
}

export default function SortGame({ challenge, onDone }: Props) {
  const [assign, setAssign] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  const unassigned = challenge.items.map((_, i) => i).filter((i) => assign[i] === undefined)
  const allAssigned = unassigned.length === 0
  const correctCount = challenge.items.filter((it, i) => assign[i] === it.bucket).length
  const score = Math.round((correctCount / challenge.items.length) * 100)

  const tapItem = (i: number) => {
    if (checked) return
    sfx.click()
    setSelected(selected === i ? null : i)
  }

  const tapBucket = (b: number) => {
    if (checked || selected === null) return
    sfx.coin()
    setAssign({ ...assign, [selected]: b })
    setSelected(null)
  }

  const unassign = (i: number) => {
    if (checked) return
    sfx.click()
    const next = { ...assign }
    delete next[i]
    setAssign(next)
  }

  return (
    <div>
      <h3 className="mb-1 font-pixel text-[11px] text-amber-300">{challenge.title}</h3>
      <p className="mb-3 text-sm text-slate-300">{challenge.instruction}</p>

      {/* tray */}
      <div className="mb-3 flex min-h-14 flex-wrap gap-2 rounded-lg border-2 border-dashed border-slate-600 bg-slate-900/60 p-2">
        {unassigned.length === 0 && <p className="w-full text-center text-xs text-slate-500">All sorted! Hit CHECK when ready.</p>}
        {unassigned.map((i) => {
          const it = challenge.items[i]
          return (
            <button
              key={i}
              onClick={() => tapItem(i)}
              className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold text-white transition-all ${
                selected === i ? 'scale-105 border-amber-300 bg-amber-500/20 shadow-[0_0_12px_rgba(252,211,77,0.5)]' : 'border-slate-500 bg-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="mr-1 text-base">{it.icon}</span>
              {it.label}
            </button>
          )
        })}
      </div>

      {/* buckets */}
      <div className={`grid gap-2 ${challenge.buckets.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {challenge.buckets.map((b, bi) => (
          <button
            key={bi}
            onClick={() => tapBucket(bi)}
            className={`min-h-28 rounded-lg border-2 p-2 text-left transition-all ${selected !== null && !checked ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ borderColor: b.color, background: `${b.color}18` }}
          >
            <p className="mb-1 text-center font-pixel text-[9px]" style={{ color: b.color }}>
              {b.icon} {b.name}
            </p>
            <div className="flex flex-wrap gap-1">
              {challenge.items.map((it, i) =>
                assign[i] === bi ? (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation()
                      // If an item is selected, a tap anywhere in the bucket assigns it;
                      // otherwise tapping a chip returns it to the tray.
                      if (selected !== null) tapBucket(bi)
                      else unassign(i)
                    }}
                    className={`inline-flex cursor-pointer items-center gap-1 rounded border px-1.5 py-1 text-[11px] font-semibold ${
                      checked
                        ? it.bucket === bi
                          ? 'border-green-400 bg-green-900/50 text-green-200'
                          : 'border-red-400 bg-red-900/50 text-red-200 line-through'
                        : 'border-slate-400 bg-slate-700 text-white'
                    }`}
                    title={checked && it.bucket !== bi ? `Belongs in ${challenge.buckets[it.bucket].name}` : undefined}
                  >
                    {it.icon} {it.label}
                    {checked && (it.bucket === bi ? ' ✓' : ` → ${challenge.buckets[it.bucket].icon}`)}
                  </span>
                ) : null,
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {!checked ? (
          <button
            disabled={!allAssigned}
            onClick={() => {
              setChecked(true)
              if (score >= 70) sfx.good()
              else sfx.bad()
            }}
            className="pix-btn bg-green-500 px-6 py-2 text-[10px] text-slate-900 disabled:opacity-40"
          >
            CHECK ✓
          </button>
        ) : (
          <button onClick={() => onDone(score)} className="pix-btn bg-amber-500 px-6 py-2 text-[10px] text-slate-900">
            CONTINUE ▸
          </button>
        )}
      </div>
      {checked && (
        <p className="mt-2 text-center text-sm font-bold text-white">
          {correctCount}/{challenge.items.length} correct — {score >= 90 ? 'Master sorter! 🌟' : score >= 60 ? 'Nice work! 💪' : 'Good try — the arrows show where items belong.'}
        </p>
      )}
    </div>
  )
}
