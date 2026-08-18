import { useState } from 'react'
import type { QuizQ } from '../game/types'
import { sfx } from '../game/sfx'

interface Props {
  title: string
  quiz: QuizQ[]
  onDone: (score: number) => void
}

export default function QuizGame({ title, quiz, onDone }: Props) {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)

  const q = quiz[idx]
  const last = idx === quiz.length - 1

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) {
      sfx.good()
      setCorrect((c) => c + 1)
    } else {
      sfx.bad()
    }
  }

  const next = () => {
    sfx.click()
    if (last) {
      const total = correct + (picked === q.answer ? 0 : 0)
      onDone(Math.round((total / quiz.length) * 100))
    } else {
      setIdx(idx + 1)
      setPicked(null)
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-pixel text-[11px] text-amber-300">{title}</h3>
        <div className="flex gap-1">
          {quiz.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${i < idx ? 'bg-green-400' : i === idx ? 'bg-amber-300' : 'bg-slate-600'}`} />
          ))}
        </div>
      </div>
      <p className="mb-4 min-h-12 whitespace-pre-line text-[15px] font-bold leading-snug text-white">{q.q}</p>
      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          let cls = 'border-slate-600 bg-slate-800 hover:border-amber-400 hover:bg-slate-700'
          if (picked !== null) {
            if (i === q.answer) cls = 'border-green-400 bg-green-900/60'
            else if (i === picked) cls = 'border-red-400 bg-red-900/60'
            else cls = 'border-slate-700 bg-slate-800 opacity-50'
          }
          return (
            <button key={i} onClick={() => pick(i)} className={`rounded-lg border-2 px-4 py-3 text-left text-sm font-semibold text-white transition-all ${cls}`}>
              <span className="mr-2 font-pixel text-[10px] text-amber-300">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          )
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 rounded-lg border-2 border-sky-700 bg-sky-950/70 p-3">
          <p className="text-sm text-sky-200">
            <span className="mr-1">{picked === q.answer ? '🎉' : '💡'}</span>
            {q.explain}
          </p>
          <button onClick={next} className="pix-btn mt-3 bg-amber-500 px-5 py-2 text-[10px] text-slate-900 hover:bg-amber-400">
            {last ? 'SEE RESULTS ▸' : 'NEXT ▸'}
          </button>
        </div>
      )}
    </div>
  )
}
