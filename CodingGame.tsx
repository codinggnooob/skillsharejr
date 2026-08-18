import { useMemo, useState } from 'react'
import type { CodingContent } from '../game/content'
import QuizGame from './QuizGame'
import { sfx } from '../game/sfx'

interface Props {
  content: CodingContent
  onDone: (score: number) => void
}

export default function CodingGame({ content, onDone }: Props) {
  const [stage, setStage] = useState(0)
  const [seqScore, setSeqScore] = useState(0)

  if (stage === 0)
    return (
      <SequenceStage
        title={content.sequence.title}
        steps={content.sequence.steps}
        onDone={(s) => {
          setSeqScore(s)
          setStage(1)
        }}
      />
    )
  return <QuizGame title="Code Master Quiz" quiz={content.quiz} onDone={(s) => onDone(Math.round((seqScore + s) / 2))} />
}

function SequenceStage({ title, steps, onDone }: { title: string; steps: string[]; onDone: (s: number) => void }) {
  const shuffled = useMemo(() => {
    const idx = steps.map((_, i) => i)
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[idx[i], idx[j]] = [idx[j], idx[i]]
    }
    // ensure not already sorted
    if (idx.every((v, i) => v === i)) idx.reverse()
    return idx
  }, [steps])

  const [placed, setPlaced] = useState<number[]>([])
  const [wrong, setWrong] = useState(0)
  const [shake, setShake] = useState<number | null>(null)

  const tap = (stepIdx: number) => {
    if (placed.includes(stepIdx)) return
    if (stepIdx === placed.length) {
      sfx.coin()
      setPlaced([...placed, stepIdx])
    } else {
      sfx.bad()
      setWrong((w) => w + 1)
      setShake(stepIdx)
      setTimeout(() => setShake(null), 400)
    }
  }

  const done = placed.length === steps.length
  const score = Math.max(20, 100 - wrong * 12)

  return (
    <div>
      <h3 className="mb-1 font-pixel text-[11px] text-amber-300">{title}</h3>
      <p className="mb-3 text-sm text-slate-300">
        An <span className="font-bold text-violet-300">algorithm</span> is steps in the right order. Tap the steps from FIRST to LAST!
      </p>

      <div className="mb-3 rounded-lg border-2 border-violet-700 bg-violet-950/40 p-3">
        <p className="mb-2 font-pixel text-[9px] text-violet-300">YOUR PROGRAM:</p>
        <div className="flex flex-col gap-1">
          {placed.map((si, i) => (
            <div key={si} className="flex items-center gap-2 rounded border border-violet-500 bg-violet-900/50 px-3 py-1.5 text-sm text-white">
              <span className="font-pixel text-[9px] text-violet-300">{i + 1}.</span> {steps[si]}
            </div>
          ))}
          {!done && <p className="text-xs text-slate-500">… tap the next step from the pile below</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {shuffled
          .filter((si) => !placed.includes(si))
          .map((si) => (
            <button
              key={si}
              onClick={() => tap(si)}
              className={`rounded-lg border-2 border-slate-600 bg-slate-800 px-3 py-2 text-left text-sm font-semibold text-white transition-all hover:border-violet-400 ${
                shake === si ? 'animate-pulse border-red-400 bg-red-900/50' : ''
              }`}
            >
              {steps[si]}
            </button>
          ))}
      </div>

      {done && (
        <div className="mt-4 rounded-lg border-2 border-green-600 bg-green-950/60 p-3 text-center">
          <p className="text-sm font-bold text-green-200">
            ✅ Program runs perfectly! {wrong === 0 ? 'Zero bugs — flawless!' : `${wrong} wrong tap${wrong > 1 ? 's' : ''} — every bug teaches you something.`}
          </p>
          <button onClick={() => onDone(score)} className="pix-btn mt-2 bg-amber-500 px-5 py-2 text-[10px] text-slate-900">
            CONTINUE ▸
          </button>
        </div>
      )}
    </div>
  )
}
