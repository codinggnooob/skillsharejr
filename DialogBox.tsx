import { useEffect, useState } from 'react'
import { sfx } from '../game/sfx'

export interface DialogState {
  speaker: string
  role?: string
  emoji: string
  color: string
  lines: string[]
  actionLabel?: string
  onAction?: () => void
  onDone: () => void
}

export default function DialogBox({ dialog }: { dialog: DialogState }) {
  const [lineIdx, setLineIdx] = useState(0)
  const [shown, setShown] = useState(0)

  const line = dialog.lines[lineIdx]
  const typing = shown < line.length
  const last = lineIdx === dialog.lines.length - 1

  useEffect(() => {
    setShown(0)
    const iv = setInterval(() => {
      setShown((s) => {
        if (s >= line.length) {
          clearInterval(iv)
          return s
        }
        return s + 2
      })
    }, 18)
    return () => clearInterval(iv)
  }, [lineIdx, line])

  const advance = () => {
    if (typing) {
      setShown(line.length)
      return
    }
    sfx.click()
    if (!last) setLineIdx(lineIdx + 1)
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center p-3" onClick={advance}>
      <div className="pix-panel w-full max-w-2xl cursor-pointer border-amber-400 bg-slate-900/95 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 text-3xl"
            style={{ borderColor: dialog.color, background: `${dialog.color}22` }}
          >
            {dialog.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-pixel text-[10px]" style={{ color: dialog.color }}>
              {dialog.speaker}
              {dialog.role && <span className="ml-2 text-[8px] text-slate-400">{dialog.role}</span>}
            </p>
            <p className="mt-2 min-h-12 text-sm leading-relaxed text-white">
              {line.slice(0, shown)}
              {typing && <span className="animate-pulse">▌</span>}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-1">
            {dialog.lines.map((_, i) => (
              <div key={i} className={`h-1.5 w-1.5 rounded-full ${i <= lineIdx ? 'bg-amber-300' : 'bg-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {!typing && last && dialog.actionLabel && dialog.onAction && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  sfx.enter()
                  dialog.onAction!()
                }}
                className="pix-btn bg-green-500 px-4 py-2 text-[10px] text-slate-900"
              >
                {dialog.actionLabel}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (typing) setShown(line.length)
                else if (!last) {
                  sfx.click()
                  setLineIdx(lineIdx + 1)
                } else {
                  sfx.click()
                  dialog.onDone()
                }
              }}
              className="pix-btn bg-amber-500 px-4 py-2 text-[10px] text-slate-900"
            >
              {typing ? '⏩' : last ? (dialog.actionLabel ? 'LATER' : 'DONE ✓') : 'NEXT ▸'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
