import { useState } from 'react'
import type { AIContent } from '../game/content'
import SortGame from './SortGame'
import QuizGame from './QuizGame'
import { sfx } from '../game/sfx'

interface Props {
  content: AIContent
  onDone: (score: number) => void
}

export default function AIGame({ content, onDone }: Props) {
  const [stage, setStage] = useState(0)
  const [scores, setScores] = useState<number[]>([])

  const push = (s: number) => {
    const all = [...scores, s]
    setScores(all)
    if (stage === 2) onDone(Math.round(all[0] * 0.5 + all[1] * 0.25 + all[2] * 0.25))
    else setStage(stage + 1)
  }

  if (stage === 0) return <SortGame challenge={content.train} onDone={push} />
  if (stage === 1) return <TestStage content={content} onDone={push} />
  return <QuizGame title="AI Thinker Quiz" quiz={content.quiz} onDone={push} />
}

function TestStage({ content, onDone }: { content: AIContent; onDone: (s: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState(false)
  const buckets = content.train.buckets

  const correct = content.test.filter((t, i) => answers[i] === t.bucket).length
  const score = Math.round((correct / content.test.length) * 100)

  return (
    <div>
      <h3 className="mb-1 font-pixel text-[11px] text-amber-300">Test Your AI!</h3>
      <p className="mb-1 text-sm text-slate-300">
        Your AI has learned from your examples. Now it sees <b>new</b> items it has never seen before.
      </p>
      <p className="mb-3 text-sm text-slate-300">Where would your trained AI put each one?</p>

      <div className="flex flex-col gap-3">
        {content.test.map((t, i) => (
          <div key={i} className="rounded-lg border-2 border-pink-700 bg-pink-950/40 p-3">
            <p className="mb-2 text-sm font-bold text-white">
              <span className="mr-1 text-lg">{t.icon}</span> {t.label}
            </p>
            <div className="flex gap-2">
              {buckets.map((b, bi) => {
                const pickedB = answers[i] === bi
                let cls = 'border-slate-600 bg-slate-800 text-white hover:border-pink-400'
                if (pickedB && !checked) cls = 'border-amber-300 bg-amber-500/20 text-white'
                if (checked && bi === t.bucket) cls = 'border-green-400 bg-green-900/50 text-green-100'
                else if (checked && pickedB) cls = 'border-red-400 bg-red-900/50 text-red-100'
                return (
                  <button
                    key={bi}
                    onClick={() => {
                      if (checked) return
                      sfx.click()
                      setAnswers({ ...answers, [i]: bi })
                    }}
                    className={`rounded-lg border-2 px-4 py-2 font-pixel text-[9px] ${cls}`}
                  >
                    {b.icon} {b.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {checked && (
        <div className="mt-3 rounded-lg border-2 border-sky-700 bg-sky-950/70 p-3 text-sm text-sky-100">
          🤖 {correct === content.test.length ? 'Your AI aced the test! Good training data = smart AI.' : 'Your AI made a mistake — that’s why humans must always check AI’s work!'}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        {!checked ? (
          <button
            disabled={Object.keys(answers).length !== content.test.length}
            onClick={() => {
              setChecked(true)
              if (score === 100) sfx.good()
              else sfx.bad()
            }}
            className="pix-btn bg-green-500 px-6 py-2 text-[10px] text-slate-900 disabled:opacity-40"
          >
            RUN AI ✓
          </button>
        ) : (
          <button onClick={() => onDone(score)} className="pix-btn bg-amber-500 px-6 py-2 text-[10px] text-slate-900">
            CONTINUE ▸
          </button>
        )}
      </div>
    </div>
  )
}
