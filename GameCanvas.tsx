import { useEffect, useRef } from 'react'
import { MAP_H, MAP_W, TILE, collides, doorFront, renderWorld } from '../game/world'
import { EXIT_TILES, NPC_TILE, ROOM_H, ROOM_W, SPAWN_TILE, interiorBlocked, renderInterior } from '../game/interior'
import { ZONES } from '../game/zones'
import { MAYOR } from '../game/story'
import type { Progress, Zone } from '../game/types'
import { drawCharacter, PLAYER_PALETTES, type Dir } from '../game/sprites'
import { sfx } from '../game/sfx'

export type Scene = 'world' | 'interior'

interface NPC {
  x: number
  y: number
  dir: Dir
  moving: boolean
  frame: number
  palette: number
  tip: string
  name: string
  timer: number
  still?: boolean
}

const NPC_TIPS: { name: string; tip: string }[] = [
  { name: 'Maya', tip: 'Earn all 9 badges to relight the Skill Beacon!' },
  { name: 'Leo', tip: 'Money tip: save first, spend second. Future-you says thanks!' },
  { name: 'Auntie Ro', tip: 'Real friends never rush you into sharing secrets online.' },
  { name: 'Kenji', tip: 'Stuck on a puzzle? Break it into tiny steps — that’s coding!' },
  { name: 'Dr. Fern', tip: 'Water, flashlight, whistle — the three heroes of any go-bag.' },
]

const NPC_SPOTS = [
  { x: 24, y: 15 },
  { x: 40, y: 27 },
  { x: 15, y: 24 },
  { x: 47, y: 16 },
  { x: 30, y: 30 },
]

interface Props {
  progress: Progress
  paused: boolean
  scene: Scene
  interiorZone: Zone | null
  moveRef: React.MutableRefObject<{ x: number; y: number }>
  onNearZone: (z: Zone | null) => void
  onNearGuide: (near: boolean) => void
  onNearExit: (near: boolean) => void
  onInteract: () => void
}

export default function GameCanvas({
  progress,
  paused,
  scene,
  interiorZone,
  moveRef,
  onNearZone,
  onNearGuide,
  onNearExit,
  onInteract,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    px: 32 * TILE,
    py: 24 * TILE,
    savedWx: 32 * TILE,
    savedWy: 24 * TILE,
    dir: 2 as Dir,
    moving: false,
    frame: 0,
    frameT: 0,
    cam: { x: 0, y: 0 },
    guideDir: 2 as Dir,
    npcs: [
      ...NPC_SPOTS.map((s, i) => ({
        x: s.x * TILE,
        y: s.y * TILE,
        dir: 2 as Dir,
        moving: false,
        frame: 0,
        palette: (i + 1) % PLAYER_PALETTES.length,
        tip: NPC_TIPS[i].tip,
        name: NPC_TIPS[i].name,
        timer: Math.random() * 3,
      })),
      // Mayor Ada stands near spawn
      {
        x: 34 * TILE,
        y: 25 * TILE,
        dir: 3 as Dir,
        moving: false,
        frame: 0,
        palette: MAYOR.palette,
        tip: 'The Beacon needs 9 badges — visit every academy!',
        name: MAYOR.name,
        timer: 999,
        still: true,
      },
    ] as NPC[],
    keys: {} as Record<string, boolean>,
    stepT: 0,
  })
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const sceneRef = useRef(scene)
  sceneRef.current = scene
  const zoneRef = useRef(interiorZone)
  zoneRef.current = interiorZone
  const progressRef = useRef(progress)
  progressRef.current = progress
  const cbRef = useRef({ onNearZone, onNearGuide, onNearExit, onInteract })
  cbRef.current = { onNearZone, onNearGuide, onNearExit, onInteract }
  const nearZoneRef = useRef<Zone | null>(null)
  const nearGuideRef = useRef(false)
  const nearExitRef = useRef(false)

  // scene switch: reposition player
  useEffect(() => {
    const s = stateRef.current
    if (scene === 'interior') {
      s.savedWx = s.px
      s.savedWy = s.py
      s.px = SPAWN_TILE.x * TILE + 4
      s.py = SPAWN_TILE.y * TILE + 4
      s.dir = 0
    } else {
      s.px = s.savedWx
      s.py = s.savedWy
      s.dir = 2
    }
    nearGuideRef.current = false
    nearExitRef.current = false
  }, [scene])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault()
      stateRef.current.keys[k] = true
      if ((k === 'e' || k === 'enter') && !pausedRef.current) cbRef.current.onInteract()
    }
    const up = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = performance.now()
    const PW = TILE * 0.78
    const PH = TILE * 0.78

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const blockedAt = (px: number, py: number, w: number, h: number): boolean => {
      if (sceneRef.current === 'interior' && zoneRef.current) {
        const x0 = Math.floor(px / TILE)
        const y0 = Math.floor(py / TILE)
        const x1 = Math.floor((px + w - 1) / TILE)
        const y1 = Math.floor((py + h - 1) / TILE)
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) if (interiorBlocked(zoneRef.current, x, y)) return true
        return false
      }
      return collides(px, py, w, h)
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const s = stateRef.current
      const t = now / 1000
      const inInterior = sceneRef.current === 'interior' && zoneRef.current

      if (!pausedRef.current) {
        // --- player movement ---
        let mx = moveRef.current.x
        let my = moveRef.current.y
        if (s.keys['arrowup'] || s.keys['w']) my -= 1
        if (s.keys['arrowdown'] || s.keys['s']) my += 1
        if (s.keys['arrowleft'] || s.keys['a']) mx -= 1
        if (s.keys['arrowright'] || s.keys['d']) mx += 1
        const len = Math.hypot(mx, my)
        s.moving = len > 0
        if (len > 0) {
          mx /= len
          my /= len
          const speed = 4.4 * TILE
          const nx = s.px + mx * speed * dt
          const ny = s.py + my * speed * dt
          if (!blockedAt(nx, s.py, PW, PH)) s.px = nx
          if (!blockedAt(s.px, ny, PW, PH)) s.py = ny
          // face the direction of travel
          if (Math.abs(mx) > Math.abs(my)) s.dir = mx > 0 ? 1 : 3
          else s.dir = my > 0 ? 2 : 0
          s.frameT += dt
          if (s.frameT > 0.17) {
            s.frame = 1 - s.frame
            s.frameT = 0
          }
          s.stepT += dt
          if (s.stepT > 0.32) {
            sfx.step()
            s.stepT = 0
          }
        }

        const ptx = (s.px + PW / 2) / TILE
        const pty = (s.py + PH / 2) / TILE

        if (!inInterior) {
          // --- world NPCs wander; face player when close ---
          for (const n of s.npcs) {
            const dist = Math.hypot(n.x - s.px, n.y - s.py)
            if (dist < TILE * 2.4) {
              // face the player
              const dx = s.px - n.x
              const dy = s.py - n.y
              n.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : dy > 0 ? 2 : 0
              n.moving = false
              n.timer = Math.max(n.timer, 0.5)
            } else if (!n.still) {
              n.timer -= dt
              if (n.timer <= 0) {
                n.timer = 1.5 + Math.random() * 2.5
                const r = Math.random()
                if (r < 0.45) n.moving = false
                else {
                  n.moving = true
                  n.dir = Math.floor(Math.random() * 4) as Dir
                }
              }
            }
            if (n.moving) {
              const sp = 1.6 * TILE
              const dx = n.dir === 1 ? sp * dt : n.dir === 3 ? -sp * dt : 0
              const dy = n.dir === 2 ? sp * dt : n.dir === 0 ? -sp * dt : 0
              if (!collides(n.x + dx, n.y + dy, PW, PH)) {
                n.x += dx
                n.y += dy
                n.frame = (n.frame + dt * 6) % 2
              } else n.timer = 0
            }
          }

          // --- near zone detection ---
          let found: Zone | null = null
          for (const z of ZONES) {
            const f = doorFront(z)
            if (Math.abs(ptx - (f.x + 0.5)) < 1.6 && Math.abs(pty - (f.y + 0.5)) < 1.6) {
              found = z
              break
            }
          }
          if (found?.id !== nearZoneRef.current?.id) {
            nearZoneRef.current = found
            cbRef.current.onNearZone(found)
          }

          // camera
          s.cam.x = Math.max(0, Math.min(s.px + PW / 2 - canvas.width / 2, MAP_W * TILE - canvas.width))
          s.cam.y = Math.max(0, Math.min(s.py + PH / 2 - canvas.height / 2, MAP_H * TILE - canvas.height))
        } else {
          // --- interior: guide faces player, exit detection ---
          const gcx = NPC_TILE.x + 0.5
          const gcy = NPC_TILE.y + 0.5
          const gdx = ptx - gcx
          const gdy = pty - gcy
          if (Math.hypot(gdx, gdy) < 5) {
            s.guideDir = Math.abs(gdx) > Math.abs(gdy) ? (gdx > 0 ? 1 : 3) : gdy > 0 ? 2 : 0
          }
          const nearG = Math.hypot(gdx, gdy) < 2.4
          if (nearG !== nearGuideRef.current) {
            nearGuideRef.current = nearG
            cbRef.current.onNearGuide(nearG)
          }
          const nearE = EXIT_TILES.some((e) => Math.abs(ptx - (e.x + 0.5)) < 1.1 && Math.abs(pty - (e.y + 0.5)) < 1.1)
          if (nearE !== nearExitRef.current) {
            nearExitRef.current = nearE
            cbRef.current.onNearExit(nearE)
          }
          // camera: center the room (with zoom)
          const zoom = Math.max(1.5, Math.min(canvas.width / (ROOM_W * TILE + 120), canvas.height / (ROOM_H * TILE + 120), 3))
          s.cam.x = (ROOM_W * TILE - canvas.width / zoom) / 2
          s.cam.y = (ROOM_H * TILE - canvas.height / zoom) / 2
        }
      }

      // ---------------- render ----------------
      const badgeMap: Record<string, string | undefined> = {}
      for (const [k, v] of Object.entries(progressRef.current.badges)) badgeMap[k] = v
      const palIdx = progressRef.current.name.length % PLAYER_PALETTES.length

      if (!inInterior) {
        renderWorld(ctx, s.cam, canvas.width, canvas.height, t, nearZoneRef.current, badgeMap)
      }

      ctx.save()
      if (inInterior && zoneRef.current) {
        // zoom interiors so the room fills the screen
        const zoom = Math.max(1.5, Math.min(canvas.width / (ROOM_W * TILE + 120), canvas.height / (ROOM_H * TILE + 120), 3))
        ctx.scale(zoom, zoom)
        renderInterior(ctx, zoneRef.current, s.cam.x, s.cam.y, t)
      }
      ctx.translate(-s.cam.x, -s.cam.y)

      if (!inInterior) {
        // world NPCs
        for (const n of s.npcs) {
          if (n.x < s.cam.x - TILE || n.x > s.cam.x + canvas.width + TILE) continue
          drawCharacter(ctx, n.x + (TILE - TILE * 0.78) / 2 - TILE * 0.16, n.y - TILE * 0.57, TILE * 1.1, n.dir, Math.floor(n.frame), n.moving, PLAYER_PALETTES[n.palette], t)
          const dist = Math.hypot(n.x - s.px, n.y - s.py)
          if (dist < TILE * 2.2) {
            const txt = n.tip
            ctx.font = '11px "Press Start 2P", monospace'
            const tw = Math.min(ctx.measureText(txt).width + 20, 340)
            const bx = Math.max(8, Math.min(n.x - tw / 2 + TILE / 2, MAP_W * TILE - tw - 8))
            const by = n.y - 78
            ctx.fillStyle = 'rgba(255,255,255,0.95)'
            ctx.fillRect(bx, by, tw, 40)
            ctx.strokeStyle = '#333'
            ctx.lineWidth = 2
            ctx.strokeRect(bx, by, tw, 40)
            ctx.fillStyle = '#333'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            const words = txt.split(' ')
            let line = ''
            let ly = by + 6
            for (const w of words) {
              if (ctx.measureText(line + w).width > tw - 16 && line) {
                ctx.fillText(line, bx + 8, ly)
                line = w + ' '
                ly += 13
              } else line += w + ' '
            }
            ctx.fillText(line, bx + 8, ly)
            ctx.fillStyle = '#7b1fa2'
            ctx.fillText(n.name, bx + 8, by - 12)
          }
        }
      } else if (zoneRef.current) {
        // guide NPC inside
        const z = zoneRef.current
        const gx = NPC_TILE.x * TILE
        const gy = NPC_TILE.y * TILE
        drawCharacter(ctx, gx - TILE * 0.05, gy - TILE * 0.55, TILE * 1.1, s.guideDir, 0, false, PLAYER_PALETTES[z.npc.palette], t)
        // name + role tag
        ctx.font = '9px "Press Start 2P", monospace'
        ctx.textAlign = 'center'
        const label = `${z.npc.emoji} ${z.npc.name}`
        const lw = ctx.measureText(label).width + 14
        ctx.fillStyle = 'rgba(20,20,40,0.8)'
        ctx.fillRect(gx + TILE / 2 - lw / 2, gy - 50, lw, 16)
        ctx.fillStyle = z.color
        ctx.fillText(label, gx + TILE / 2, gy - 37)
        // talk indicator
        if (nearGuideRef.current) {
          const bob = Math.sin(t * 5) * 3
          ctx.font = '16px sans-serif'
          ctx.fillText('💬', gx + TILE / 2, gy - 58 + bob)
        }
      }

      // player
      drawCharacter(ctx, s.px - TILE * 0.16, s.py - TILE * 0.57, TILE * 1.1, s.dir, s.frame, s.moving, PLAYER_PALETTES[palIdx], t, true)

      // player name tag
      ctx.font = '9px "Press Start 2P", monospace'
      ctx.textAlign = 'center'
      const name = progressRef.current.name || 'Hero'
      const nw = ctx.measureText(name).width + 12
      ctx.fillStyle = 'rgba(20,20,40,0.75)'
      ctx.fillRect(s.px + PW / 2 - nw / 2, s.py - 46, nw, 15)
      ctx.fillStyle = '#ffe082'
      ctx.fillText(name, s.px + PW / 2, s.py - 34)

      ctx.restore()
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [moveRef])

  return <canvas ref={canvasRef} className="block h-full w-full" style={{ imageRendering: 'pixelated' }} />
}
