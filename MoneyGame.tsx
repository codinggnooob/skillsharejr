import { useState } from 'react'
import type { MoneyContent } from '../game/content'
import SortGame from './SortGame'
import QuizGame from './QuizGame'
import { sfx } from '../game/sfx'

interface Props {
  content: MoneyContent
  onDone: (score: number) => void
}

export default function MoneyGame({ content, onDone }: Props) {
  const [stage, setStage] = useState(0)
  const [scores, setScores] = useState<number[]>([])

  const finish = (s: number) => {
    const next = [...scores, s]
    setScores(next)
    if (stage === 2) onDone(Math.round(next.reduce((a, b) => a + b, 0) / next.length))
    else setStage(stage + 1)
  }

  if (stage === 0) return <SortGame challenge={content.sort} onDone={finish} />
  if (stage === 1) return <BudgetStage content={content} onDone={finish} />
  return <QuizGame title="Money Master Quiz" quiz={content.quiz} onDone={finish} />
}

function BudgetStage({ content, onDone }: { content: MoneyContent; onDone: (s: number) => void }) {
  const b = content.budget
  const step = b.income >= 500 ? 50 : b.income >= 50 ? 5 : 1
  const free = b.income - b.fixedCost
  const [alloc, setAlloc] = useState({ save: 0, spend: 0, share: 0 })
  const [checked, setChecked] = useState(false)
  const used = alloc.save + alloc.spend + alloc.share
  const left = free - used

  const bump = (k: keyof typeof alloc, d: number) => {
    if (checked) return
    const v = alloc[k] + d * step
    if (v < 0) return
    if (d > 0 && left < step) {
      sfx.bad()
      return
    }
    sfx.click()
    setAlloc({ ...alloc, [k]: v })
  }

  let score = 30
  if (alloc.save >= b.saveTarget) score = alloc.spend <= free * 0.65 ? 100 : 85
  else if (alloc.save >= b.saveTarget * 0.5) score = 60

  const verdict =
    score === 100
      ? 'Perfect budget! Needs covered, savings goal smashed, and room for fun. 🌟'
      : score >= 80
        ? 'Great saving! Spending is a bit high — fun is fine, but savings grow your future.'
        : score >= 60
          ? 'You saved some! Try to hit the savings target — pay yourself first.'
          : 'Savings came last this time. Rule #1 of money: save BEFORE you spend!'

  const cats: { k: keyof typeof alloc; name: string; icon: string; color: string; desc: string }[] = [
    { k: 'save', name: 'SAVE', icon: '🏦', color: '#22c55e', desc: 'For goals & surprises' },
    { k: 'spend', name: 'SPEND', icon: '🎉', color: '#f59e0b', desc: 'Fun stuff' },
    { k: 'share', name: 'SHARE', icon: '💝', color: '#ec4899', desc: 'Gifts & helping' },
  ]

  const barTotal = Math.max(used, 1)

  return (
    <div>
      <h3 className="mb-1 font-pixel text-[11px] text-amber-300">Budget Challenge</h3>
      <p className="mb-3 text-sm text-slate-300">{b.hint}</p>

      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border-2 border-slate-600 bg-slate-800 p-2">
          <p className="font-pixel text-[8px] text-slate-400">INCOME</p>
          <p className="text-lg font-bold text-white">🪙 {b.income}</p>
        </div>
        <div className="rounded-lg border-2 border-slate-600 bg-slate-800 p-2">
          <p className="font-pixel text-[8px] text-slate-400">{b.fixedLabel.toUpperCase()}</p>
          <p className="text-lg font-bold text-red-300">− {b.fixedCost}</p>
        </div>
        <div className="rounded-lg border-2 border-sky-600 bg-sky-950 p-2">
          <p className="font-pixel text-[8px] text-sky-300">LEFT TO PLAN</p>
          <p className="text-lg font-bold text-sky-200">🪙 {left}</p>
        </div>
      </div>

      {/* allocation bar */}
      <div className="mb-3 flex h-6 overflow-hidden rounded-lg border-2 border-slate-600">
        <div style={{ width: `${(alloc.save / barTotal) * (used / free) * 100}%`, background: '#22c55e' }} />
        <div style={{ width: `${(alloc.spend / barTotal) * (used / free) * 100}%`, background: '#f59e0b' }} />
        <div style={{ width: `${(alloc.share / barTotal) * (used / free) * 100}%`, background: '#ec4899' }} />
        <div className="flex-1 bg-slate-800" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {cats.map((c) => (
          <div key={c.k} className="rounded-lg border-2 p-2 text-center" style={{ borderColor: c.color, background: `${c.color}15` }}>
            <p className="font-pixel text-[9px]" style={{ color: c.color }}>
              {c.icon} {c.name}
            </p>
            <p className="my-1 text-xl font-bold text-white">{alloc[c.k]}</p>
            <p className="mb-2 text-[10px] text-slate-400">{c.desc}</p>
            <div className="flex justify-center gap-1">
              <button onClick={() => bump(c.k, -1)} className="h-8 w-8 rounded bg-slate-700 text-lg font-bold text-white hover:bg-slate-600">
                −
              </button>
              <button onClick={() => bump(c.k, 1)} className="h-8 w-8 rounded bg-slate-700 text-lg font-bold text-white hover:bg-slate-600">
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        Savings goal: <span className="font-bold text-green-300">🪙 {b.saveTarget}+</span> · Steps of {step} {b.unit}
      </p>

      {checked && (
        <div className="mt-3 rounded-lg border-2 border-sky-700 bg-sky-950/70 p-3 text-sm text-sky-100">{verdict}</div>
      )}

      <div className="mt-4 flex justify-end">
        {!checked ? (
          <button
            disabled={left !== 0}
            onClick={() => {
              setChecked(true)
              if (score >= 70) sfx.good()
              else sfx.bad()
            }}
            className="pix-btn bg-green-500 px-6 py-2 text-[10px] text-slate-900 disabled:opacity-40"
          >
            CONFIRM BUDGET ✓
          </button>
        ) : (
          <button onClick={() => onDone(score)} className="pix-btn bg-amber-500 px-6 py-2 text-[10px] text-slate-900">
            CONTINUE ▸
          </button>
        )}
      </div>
      {left !== 0 && !checked && <p className="mt-2 text-center text-xs text-amber-300">Plan every coin before confirming!</p>}
    </div>
  )
}
