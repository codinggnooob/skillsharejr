import { useState } from 'react'
import type { AgeGroup, Zone } from '../game/types'
import { badgeForScore } from '../game/types'
import { getZoneContent } from '../game/content'
import MoneyGame from '../games/MoneyGame'
import RoboticsGame from '../games/RoboticsGame'
import CodingGame from '../games/CodingGame'
import AIGame from '../games/AIGame'
import { DisasterGame, SortZoneGame, WellnessGame } from '../games/Composites'
import { sfx } from '../game/sfx'

interface Props {
  zone: Zone
  age: AgeGroup
  onFinish: (score: number) => void
  onClose: () => void
}

export default function GameModal({ zone, age, onFinish, onClose }: Props) {
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [replayKey, setReplayKey] = useState(0)
  const content = getZoneContent(zone.id, age)

  const badge = finalScore !== null ? badgeForScore(finalScore) : null
  const coins = finalScore !== null ? Math.round(finalScore / 4) : 0

  const renderGame = () => {
    switch (content.kind) {
      case 'money':
        return <MoneyGame key={replayKey} content={content.data} onDone={setFinalScore} />
      case 'disaster':
        return <DisasterGame key={replayKey} content={content.data} onDone={setFinalScore} />
      case 'robotics':
        return <RoboticsGame key={replayKey} intro={content.data.intro} levels={content.data.levels} onDone={setFinalScore} />
      case 'coding':
        return <CodingGame key={replayKey} content={content.data} onDone={setFinalScore} />
      case 'ai':
        return <AIGame key={replayKey} content={content.data} onDone={setFinalScore} />
      case 'wellness':
        return <WellnessGame key={replayKey} content={content.data} onDone={setFinalScore} />
      case 'sort':
        return <SortZoneGame key={replayKey} challenge={content.data} quiz={content.quiz} quizTitle={`${zone.skill} Wisdom`} onDone={setFinalScore} />
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm" onClick={onClose}>
      <div
        className="pix-panel max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-slate-900 p-5"
        style={{ borderColor: zone.color }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-slate-700 pb-3">
          <div>
            <p className="font-pixel text-[13px]" style={{ color: zone.color }}>
              {zone.icon} {zone.name.toUpperCase()}
            </p>
            <p className="mt-1 text-xs text-slate-400">{zone.tagline}</p>
          </div>
          <button onClick={onClose} className="pix-btn bg-slate-700 px-3 py-2 text-[10px] text-white">
            ✖
          </button>
        </div>

        {finalScore === null ? (
          renderGame()
        ) : (
          <div className="text-center">
            <p className="font-pixel text-[11px] text-amber-300">CHALLENGE COMPLETE!</p>
            <div className="my-4 text-5xl">{finalScore >= 90 ? '🏆' : finalScore >= 70 ? '🌟' : finalScore >= 50 ? '💪' : '📚'}</div>
            <p className="font-pixel text-2xl text-white">{finalScore}%</p>
            {badge && (
              <p className="mt-2 font-pixel text-[10px]" style={{ color: badge === 'gold' ? '#ffd54f' : badge === 'silver' ? '#c0c8d0' : '#cd7f32' }}>
                {badge === 'gold' ? '🥇 GOLD' : badge === 'silver' ? '🥈 SILVER' : '🥉 BRONZE'} BADGE EARNED
              </p>
            )}
            <p className="mt-2 text-sm text-slate-300">
              +{finalScore} XP · +{coins} 🪙 LifeCoins
            </p>

            <div className="mx-auto mt-4 max-w-md rounded-lg border-2 border-slate-600 bg-slate-800/70 p-3 text-left">
              <p className="mb-2 font-pixel text-[9px] text-sky-300">🎓 WHAT YOU LEARNED</p>
              <ul className="space-y-1 text-sm text-slate-200">
                {zone.learnings.map((l, i) => (
                  <li key={i}>• {l}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => {
                  sfx.click()
                  setFinalScore(null)
                  setReplayKey((k) => k + 1)
                }}
                className="pix-btn bg-slate-600 px-5 py-3 text-[10px] text-white"
              >
                ↺ PLAY AGAIN
              </button>
              <button
                onClick={() => {
                  sfx.badge()
                  onFinish(finalScore)
                }}
                className="pix-btn bg-amber-500 px-5 py-3 text-[10px] text-slate-900"
              >
                BACK TO THE ACADEMY ▸
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
