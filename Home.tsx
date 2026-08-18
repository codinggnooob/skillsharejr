import { useCallback, useEffect, useRef, useState } from 'react'
import GameCanvas, { type Scene } from '../components/GameCanvas'
import HUD from '../components/HUD'
import GameModal from '../components/GameModal'
import DialogBox, { type DialogState } from '../components/DialogBox'
import type { AgeGroup, Progress, Zone } from '../game/types'
import { badgeForScore, BADGE_ORDER } from '../game/types'
import { ZONES } from '../game/zones'
import { BEACON_LIT, MAYOR, MAYOR_INTRO } from '../game/story'
import { sfx } from '../game/sfx'

const SAVE_KEY = 'skillsharejr-v1'

function loadSave(): Progress | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? (JSON.parse(raw) as Progress) : null
  } catch {
    return null
  }
}

const DEFAULT_PROGRESS: Progress = { name: 'Hero', ageGroup: 'explorer', xp: 0, coins: 0, badges: {} }

export default function Home() {
  const [progress, setProgress] = useState<Progress>(() => loadSave() ?? DEFAULT_PROGRESS)
  const [scene, setScene] = useState<Scene>('world')
  const [interiorZone, setInteriorZone] = useState<Zone | null>(null)
  const [nearZone, setNearZone] = useState<Zone | null>(null)
  const [nearGuide, setNearGuide] = useState(false)
  const [nearExit, setNearExit] = useState(false)
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [activeZone, setActiveZone] = useState<Zone | null>(null)
  const [fading, setFading] = useState(false)
  const moveRef = useRef({ x: 0, y: 0 })
  const padState = useRef<Record<string, boolean>>({})

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress))
  }, [progress])

  // Opening storyline on first visit
  useEffect(() => {
    if (!progress.introSeen) {
      setDialog({
        speaker: MAYOR.name,
        role: MAYOR.role,
        emoji: MAYOR.emoji,
        color: '#f59e0b',
        lines: MAYOR_INTRO,
        onDone: () => {
          setDialog(null)
          setProgress((p) => ({ ...p, introSeen: true }))
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const transition = useCallback((fn: () => void) => {
    setFading(true)
    sfx.enter()
    setTimeout(() => {
      fn()
      setTimeout(() => setFading(false), 60)
    }, 420)
  }, [])

  const enterBuilding = useCallback(
    (zone: Zone) => {
      transition(() => {
        setInteriorZone(zone)
        setScene('interior')
        setNearZone(null)
      })
    },
    [transition],
  )

  const exitBuilding = useCallback(() => {
    transition(() => {
      setScene('world')
      setInteriorZone(null)
      setNearGuide(false)
      setNearExit(false)
    })
  }, [transition])

  const talkToGuide = useCallback(() => {
    if (!interiorZone) return
    const z = interiorZone
    const firstTime = !(progress.met ?? []).includes(z.id)
    const hasBadge = !!progress.badges[z.id]
    const lines = firstTime ? z.npc.intro : [hasBadge ? z.npc.congrats : z.npc.prompt]
    setDialog({
      speaker: z.npc.name,
      role: z.npc.role,
      emoji: z.npc.emoji,
      color: z.color,
      lines,
      actionLabel: '⚔️ START CHALLENGE',
      onAction: () => {
        setDialog(null)
        setProgress((p) => ({ ...p, met: [...new Set([...(p.met ?? []), z.id])] }))
        setActiveZone(z)
      },
      onDone: () => {
        setDialog(null)
        setProgress((p) => ({ ...p, met: [...new Set([...(p.met ?? []), z.id])] }))
      },
    })
  }, [interiorZone, progress])

  const onInteract = useCallback(() => {
    if (dialog || activeZone || fading) return
    if (scene === 'world' && nearZone) enterBuilding(nearZone)
    else if (scene === 'interior' && nearGuide) talkToGuide()
    else if (scene === 'interior' && nearExit) exitBuilding()
  }, [dialog, activeZone, fading, scene, nearZone, nearGuide, nearExit, enterBuilding, talkToGuide, exitBuilding])

  const finishZone = useCallback(
    (score: number) => {
      if (!activeZone) return
      const z = activeZone
      const newBadge = badgeForScore(score)
      const oldBadge = progress.badges[z.id]
      const better = newBadge && (!oldBadge || BADGE_ORDER.indexOf(newBadge) > BADGE_ORDER.indexOf(oldBadge))
      const next: Progress = {
        ...progress,
        xp: progress.xp + score,
        coins: progress.coins + Math.round(score / 4),
        badges: better ? { ...progress.badges, [z.id]: newBadge } : progress.badges,
      }
      setProgress(next)
      setActiveZone(null)
      // congrats dialog back inside the academy
      if (better) {
        setDialog({
          speaker: z.npc.name,
          role: z.npc.role,
          emoji: z.npc.emoji,
          color: z.color,
          lines: [z.npc.congrats],
          onDone: () => {
            setDialog(null)
            const allBadges = ZONES.every((zz) => next.badges[zz.id])
            if (allBadges && !next.celebrated) {
              setDialog({
                speaker: MAYOR.name,
                role: MAYOR.role,
                emoji: MAYOR.emoji,
                color: '#f59e0b',
                lines: BEACON_LIT,
                onDone: () => {
                  setDialog(null)
                  setProgress((p) => ({ ...p, celebrated: true }))
                },
              })
            }
          },
        })
      }
    },
    [activeZone, progress],
  )

  const reset = useCallback(() => {
    localStorage.removeItem(SAVE_KEY)
    setProgress(DEFAULT_PROGRESS)
    setScene('world')
    setInteriorZone(null)
    setDialog(null)
    setActiveZone(null)
    window.location.reload()
  }, [])

  const setAge = useCallback((ageGroup: AgeGroup) => {
    setProgress((p) => ({ ...p, ageGroup }))
  }, [])

  // touch pad helpers
  const setPad = (dir: string, down: boolean) => {
    padState.current[dir] = down
    const x = (padState.current.right ? 1 : 0) - (padState.current.left ? 1 : 0)
    const y = (padState.current.down ? 1 : 0) - (padState.current.up ? 1 : 0)
    moveRef.current = { x, y }
  }

  const paused = dialog !== null || activeZone !== null || fading
  const padBtn =
    'flex h-14 w-14 items-center justify-center rounded-lg border-2 border-slate-500 bg-slate-800/80 text-xl text-white active:bg-amber-500 active:text-slate-900 select-none touch-none'

  // prompt bar content
  let prompt: { icon: string; title: string; sub: string; color: string; label: string } | null = null
  if (!paused) {
    if (scene === 'world' && nearZone) {
      prompt = {
        icon: nearZone.icon,
        title: nearZone.name.toUpperCase(),
        sub: `${nearZone.skill} · ${progress.badges[nearZone.id] ? `badge: ${progress.badges[nearZone.id]}` : 'no badge yet'}`,
        color: nearZone.color,
        label: 'ENTER [E]',
      }
    } else if (scene === 'interior' && interiorZone && nearGuide) {
      prompt = {
        icon: interiorZone.npc.emoji,
        title: interiorZone.npc.name.toUpperCase(),
        sub: interiorZone.npc.role,
        color: interiorZone.color,
        label: 'TALK [E]',
      }
    } else if (scene === 'interior' && nearExit) {
      prompt = { icon: '🚪', title: 'EXIT', sub: 'Back to SkillShare Town', color: '#4ade80', label: 'LEAVE [E]' }
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950">
      <GameCanvas
        progress={progress}
        paused={paused}
        scene={scene}
        interiorZone={interiorZone}
        moveRef={moveRef}
        onNearZone={setNearZone}
        onNearGuide={setNearGuide}
        onNearExit={setNearExit}
        onInteract={onInteract}
      />

      <div className="retro-overlay" />

      <HUD progress={progress} onReset={reset} onSetAge={setAge} />

      {/* scene title tag */}
      {scene === 'interior' && interiorZone && (
        <div className="absolute left-1/2 top-16 z-20 -translate-x-1/2">
          <p className="rounded-lg border-2 px-3 py-1.5 font-pixel text-[10px]" style={{ borderColor: interiorZone.color, color: interiorZone.color, background: 'rgba(2,6,23,0.85)' }}>
            {interiorZone.icon} {interiorZone.name.toUpperCase()}
          </p>
        </div>
      )}

      {/* interaction prompt */}
      {prompt && (
        <div className="absolute inset-x-0 bottom-16 z-20 flex justify-center px-3">
          <div className="flex items-center gap-3 rounded-lg border-2 px-4 py-2.5" style={{ borderColor: prompt.color, background: 'rgba(2,6,23,0.92)' }}>
            <span className="text-2xl">{prompt.icon}</span>
            <div>
              <p className="font-pixel text-[10px]" style={{ color: prompt.color }}>
                {prompt.title}
              </p>
              <p className="text-[11px] text-slate-300">{prompt.sub}</p>
            </div>
            <button onClick={onInteract} className="pix-btn bg-amber-500 px-4 py-2.5 text-[10px] text-slate-900">
              {prompt.label}
            </button>
          </div>
        </div>
      )}

      {/* touch d-pad */}
      {!paused && (
        <div className="absolute bottom-16 left-2 z-20 grid grid-cols-3 gap-1 sm:bottom-20">
          <div />
          <button className={padBtn} onPointerDown={() => setPad('up', true)} onPointerUp={() => setPad('up', false)} onPointerLeave={() => setPad('up', false)}>
            ▲
          </button>
          <div />
          <button className={padBtn} onPointerDown={() => setPad('left', true)} onPointerUp={() => setPad('left', false)} onPointerLeave={() => setPad('left', false)}>
            ◀
          </button>
          <div />
          <button className={padBtn} onPointerDown={() => setPad('right', true)} onPointerUp={() => setPad('right', false)} onPointerLeave={() => setPad('right', false)}>
            ▶
          </button>
          <div />
          <button className={padBtn} onPointerDown={() => setPad('down', true)} onPointerUp={() => setPad('down', false)} onPointerLeave={() => setPad('down', false)}>
            ▼
          </button>
          <div />
        </div>
      )}

      {/* dialog */}
      {dialog && <DialogBox dialog={dialog} />}

      {/* mini-game modal */}
      {activeZone && <GameModal zone={activeZone} age={progress.ageGroup} onFinish={finishZone} onClose={() => setActiveZone(null)} />}

      {/* scene transition fade */}
      <div
        className="pointer-events-none absolute inset-0 z-40 bg-black transition-opacity duration-300"
        style={{ opacity: fading ? 1 : 0 }}
      />
    </div>
  )
}
