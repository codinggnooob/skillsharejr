import { useState } from 'react'
import type { DisasterContent, WellnessContent } from '../game/content'
import type { QuizQ, SortChallenge } from '../game/types'
import SortGame from './SortGame'
import PickGame from './PickGame'
import QuizGame from './QuizGame'

/* Disaster: pack the go-bag, then scenario quiz */
export function DisasterGame({ content, onDone }: { content: DisasterContent; onDone: (s: number) => void }) {
  const [stage, setStage] = useState(0)
  const [bagScore, setBagScore] = useState(0)
  if (stage === 0)
    return (
      <PickGame
        challenge={content.bag}
        onDone={(s) => {
          setBagScore(s)
          setStage(1)
        }}
      />
    )
  return <QuizGame title="Emergency Hero Quiz" quiz={content.quiz} onDone={(s) => onDone(Math.round(bagScore * 0.5 + s * 0.5))} />
}

/* Wellness: build a plate, then feelings/health quiz */
export function WellnessGame({ content, onDone }: { content: WellnessContent; onDone: (s: number) => void }) {
  const [stage, setStage] = useState(0)
  const [plateScore, setPlateScore] = useState(0)
  if (stage === 0)
    return (
      <PickGame
        challenge={content.plate}
        onDone={(s) => {
          setPlateScore(s)
          setStage(1)
        }}
      />
    )
  return <QuizGame title="Mind & Body Quiz" quiz={content.quiz} onDone={(s) => onDone(Math.round(plateScore * 0.5 + s * 0.5))} />
}

/* Media / Time / Green: sort challenge, then a quick wisdom question */
export function SortZoneGame({ challenge, quiz, quizTitle, onDone }: { challenge: SortChallenge; quiz: QuizQ[]; quizTitle: string; onDone: (s: number) => void }) {
  const [stage, setStage] = useState(0)
  const [sortScore, setSortScore] = useState(0)
  if (stage === 0)
    return (
      <SortGame
        challenge={challenge}
        onDone={(s) => {
          setSortScore(s)
          setStage(1)
        }}
      />
    )
  return <QuizGame title={quizTitle} quiz={quiz} onDone={(s) => onDone(Math.round(sortScore * 0.75 + s * 0.25))} />
}
