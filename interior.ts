import type { Zone } from './types'
import { TILE, hash } from './world'

export const ROOM_W = 18
export const ROOM_H = 13
export const NPC_TILE = { x: 9, y: 2 }
export const SPAWN_TILE = { x: 9, y: 9 }
export const EXIT_TILES = [
  { x: 8, y: 11 },
  { x: 9, y: 11 },
]

interface DecorItem {
  x: number
  y: number
  emoji: string
  block: boolean
  size?: number
}

// Per-theme floor colors [a, b], wall color, and decor
interface Theme {
  floorA: string
  floorB: string
  wall: string
  wallTop: string
  decor: DecorItem[]
  rugs?: { x: number; y: number; w: number; h: number; color: string }[]
}

const THEMES: Record<string, Theme> = {
  bank: {
    floorA: '#e8dcc4', floorB: '#dfd2b6', wall: '#92400e', wallTop: '#b45309',
    rugs: [{ x: 6, y: 7, w: 6, h: 3, color: '#b45309' }],
    decor: [
      { x: 2, y: 1, emoji: '🏧', block: true },
      { x: 15, y: 1, emoji: '💰', block: true },
      { x: 3, y: 1, emoji: '🪙', block: true },
      { x: 14, y: 1, emoji: '📊', block: true },
      { x: 5, y: 4, emoji: '💼', block: true },
      { x: 12, y: 4, emoji: '💼', block: true },
      { x: 1, y: 8, emoji: '🪴', block: true },
      { x: 16, y: 8, emoji: '🪴', block: true },
    ],
  },
  safety: {
    floorA: '#d7d3cd', floorB: '#ccc7c0', wall: '#7f1d1d', wallTop: '#b91c1c',
    rugs: [{ x: 6, y: 7, w: 6, h: 3, color: '#b91c1c' }],
    decor: [
      { x: 2, y: 1, emoji: '🧯', block: true },
      { x: 15, y: 1, emoji: '🪜', block: true },
      { x: 3, y: 1, emoji: '🗺️', block: true },
      { x: 14, y: 1, emoji: '📟', block: true },
      { x: 1, y: 4, emoji: '🪣', block: true },
      { x: 16, y: 4, emoji: '🧤', block: true },
      { x: 4, y: 9, emoji: '🔺', block: true },
      { x: 13, y: 9, emoji: '🔺', block: true },
    ],
  },
  robo: {
    floorA: '#b9c4cc', floorB: '#adb9c2', wall: '#164e63', wallTop: '#0e7490',
    decor: [
      { x: 2, y: 1, emoji: '🦾', block: true },
      { x: 15, y: 1, emoji: '🤖', block: true },
      { x: 3, y: 1, emoji: '🔩', block: true },
      { x: 14, y: 1, emoji: '🔋', block: true },
      { x: 5, y: 4, emoji: '🖥️', block: true },
      { x: 12, y: 4, emoji: '🖥️', block: true },
      { x: 1, y: 6, emoji: '🔌', block: true },
      { x: 16, y: 6, emoji: '⚡', block: true },
    ],
  },
  code: {
    floorA: '#d9b98c', floorB: '#d0ae7e', wall: '#4c1d95', wallTop: '#6d28d9',
    rugs: [{ x: 4, y: 6, w: 10, h: 4, color: '#6d28d9' }],
    decor: [
      { x: 2, y: 1, emoji: '📜', block: true },
      { x: 15, y: 1, emoji: '📜', block: true },
      { x: 3, y: 1, emoji: '🖥️', block: true },
      { x: 14, y: 1, emoji: '🖥️', block: true },
      { x: 5, y: 4, emoji: '⌨️', block: true },
      { x: 12, y: 4, emoji: '⌨️', block: true },
      { x: 1, y: 8, emoji: '🎍', block: true },
      { x: 16, y: 8, emoji: '🍵', block: true },
    ],
  },
  ai: {
    floorA: '#2e2a4d', floorB: '#292542', wall: '#831843', wallTop: '#be185d',
    decor: [
      { x: 2, y: 1, emoji: '🧠', block: true },
      { x: 15, y: 1, emoji: '💾', block: true },
      { x: 3, y: 1, emoji: '📡', block: true },
      { x: 14, y: 1, emoji: '🔮', block: true },
      { x: 1, y: 4, emoji: '🖥️', block: true },
      { x: 16, y: 4, emoji: '🖥️', block: true },
      { x: 5, y: 9, emoji: '💡', block: true },
      { x: 12, y: 9, emoji: '💡', block: true },
    ],
  },
  media: {
    floorA: '#cfa876', floorB: '#c49d6b', wall: '#1e3a8a', wallTop: '#1d4ed8',
    rugs: [{ x: 7, y: 6, w: 4, h: 4, color: '#1d4ed8' }],
    decor: [
      { x: 2, y: 1, emoji: '📚', block: true },
      { x: 3, y: 1, emoji: '📚', block: true },
      { x: 14, y: 1, emoji: '📚', block: true },
      { x: 15, y: 1, emoji: '📚', block: true },
      { x: 5, y: 5, emoji: '📰', block: true },
      { x: 12, y: 5, emoji: '📖', block: true },
      { x: 1, y: 8, emoji: '🛋️', block: true },
      { x: 16, y: 8, emoji: '🛋️', block: true },
    ],
  },
  wellness: {
    floorA: '#cfe8d2', floorB: '#c4dfc8', wall: '#14532d', wallTop: '#16a34a',
    rugs: [{ x: 4, y: 6, w: 4, h: 3, color: '#3b82f6' }, { x: 10, y: 6, w: 4, h: 3, color: '#ec4899' }],
    decor: [
      { x: 2, y: 1, emoji: '🪴', block: true },
      { x: 15, y: 1, emoji: '🪴', block: true },
      { x: 3, y: 1, emoji: '🏋️', block: true },
      { x: 14, y: 1, emoji: '🧘', block: true },
      { x: 5, y: 4, emoji: '🍎', block: true },
      { x: 12, y: 4, emoji: '💧', block: true },
      { x: 1, y: 3, emoji: '🩺', block: true },
      { x: 16, y: 3, emoji: '🥗', block: true },
    ],
  },
  time: {
    floorA: '#e3d5bb', floorB: '#d9c9ac', wall: '#7c2d12', wallTop: '#c2410c',
    decor: [
      { x: 2, y: 1, emoji: '🕰️', block: true },
      { x: 15, y: 1, emoji: '⏳', block: true },
      { x: 3, y: 1, emoji: '⏰', block: true },
      { x: 14, y: 1, emoji: '🔔', block: true },
      { x: 1, y: 5, emoji: '⚙️', block: true },
      { x: 16, y: 5, emoji: '⚙️', block: true },
      { x: 5, y: 9, emoji: '📅', block: true },
      { x: 12, y: 9, emoji: '🗓️', block: true },
    ],
  },
  green: {
    floorA: '#bfe3b4', floorB: '#b3d9a8', wall: '#365314', wallTop: '#4d7c0f',
    rugs: [{ x: 6, y: 8, w: 6, h: 2, color: '#8d6e63' }],
    decor: [
      { x: 2, y: 1, emoji: '🪴', block: true },
      { x: 15, y: 1, emoji: '🪴', block: true },
      { x: 3, y: 1, emoji: '🌻', block: true },
      { x: 14, y: 1, emoji: '🌷', block: true },
      { x: 4, y: 4, emoji: '🌱', block: true },
      { x: 13, y: 4, emoji: '🌱', block: true },
      { x: 1, y: 5, emoji: '💧', block: true },
      { x: 16, y: 5, emoji: '🪺', block: true },
    ],
  },
}

export function interiorBlocked(zone: Zone, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= ROOM_W || y >= ROOM_H) return true
  // walls
  if (x === 0 || x === ROOM_W - 1 || y === 0 || y === ROOM_H - 1) {
    // door gap at bottom center
    if (y === ROOM_H - 1 && (x === 8 || x === 9)) return false
    return true
  }
  // NPC
  if (x === NPC_TILE.x && y === NPC_TILE.y) return true
  // decor
  const theme = THEMES[zone.id]
  return theme.decor.some((d) => d.block && d.x === x && d.y === y)
}

export function renderInterior(ctx: CanvasRenderingContext2D, zone: Zone, camX: number, camY: number, t: number) {
  const theme = THEMES[zone.id]
  ctx.save()
  ctx.translate(-camX, -camY)

  // outer void
  ctx.fillStyle = '#0b1020'
  ctx.fillRect(camX - 50, camY - 50, 4000, 4000)

  // floor
  for (let y = 0; y < ROOM_H; y++) {
    for (let x = 0; x < ROOM_W; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? theme.floorA : theme.floorB
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE)
      // subtle floor texture
      if (hash(x, y, 11) < 0.12) {
        ctx.fillStyle = 'rgba(0,0,0,0.05)'
        ctx.fillRect(x * TILE + 8, y * TILE + 10, 6, 4)
      }
    }
  }

  // AI theme: animated circuit glow
  if (zone.id === 'ai') {
    ctx.fillStyle = `rgba(236,72,153,${0.12 + Math.sin(t * 2) * 0.06})`
    for (let x = 2; x < ROOM_W - 2; x += 3) ctx.fillRect(x * TILE + 16, TILE, 3, (ROOM_H - 2) * TILE)
    for (let y = 2; y < ROOM_H - 2; y += 3) ctx.fillRect(TILE, y * TILE + 16, (ROOM_W - 2) * TILE, 3)
  }

  // rugs
  for (const r of theme.rugs ?? []) {
    ctx.fillStyle = r.color
    ctx.fillRect(r.x * TILE, r.y * TILE, r.w * TILE, r.h * TILE)
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.fillRect(r.x * TILE + 4, r.y * TILE + 4, r.w * TILE - 8, r.h * TILE - 8)
  }

  // walls
  for (let x = 0; x < ROOM_W; x++) {
    ctx.fillStyle = theme.wall
    ctx.fillRect(x * TILE, 0, TILE, TILE)
    ctx.fillStyle = theme.wallTop
    ctx.fillRect(x * TILE, 0, TILE, 10)
    // bottom wall (with door gap)
    if (x !== 8 && x !== 9) {
      ctx.fillStyle = theme.wall
      ctx.fillRect(x * TILE, (ROOM_H - 1) * TILE, TILE, TILE)
    }
  }
  for (let y = 0; y < ROOM_H; y++) {
    ctx.fillStyle = theme.wall
    ctx.fillRect(0, y * TILE, TILE, TILE)
    ctx.fillRect((ROOM_W - 1) * TILE, y * TILE, TILE, TILE)
  }

  // wall banner with zone icon
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fillRect(7 * TILE, 2, 4 * TILE, 30)
  ctx.font = '20px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#000'
  ctx.fillText(zone.icon, 9 * TILE, 17)

  // exit mat + glow
  const pulse = (Math.sin(t * 4) + 1) / 2
  for (const e of EXIT_TILES) {
    ctx.fillStyle = `rgba(74,222,128,${0.35 + pulse * 0.25})`
    ctx.fillRect(e.x * TILE + 2, e.y * TILE + 2, TILE - 4, TILE - 4)
  }
  ctx.font = '16px sans-serif'
  ctx.fillStyle = '#000'
  ctx.fillText('🚪', 9 * TILE, (ROOM_H - 1) * TILE + 18)

  // decor
  for (const d of theme.decor) {
    // base pad
    ctx.fillStyle = 'rgba(0,0,0,0.12)'
    ctx.fillRect(d.x * TILE + 3, d.y * TILE + TILE - 8, TILE - 6, 6)
    ctx.font = `${d.size ?? 26}px sans-serif`
    ctx.fillStyle = '#000' // opaque so color-emoji glyphs render at full strength
    ctx.fillText(d.emoji, d.x * TILE + TILE / 2, d.y * TILE + TILE / 2 + 2)
  }

  // special animated bits
  if (zone.id === 'safety') {
    // blinking alarm
    const on = Math.sin(t * 6) > 0
    ctx.fillStyle = on ? '#ff5252' : '#7f1d1d'
    ctx.beginPath()
    ctx.arc(9 * TILE, 14, 7, 0, Math.PI * 2)
    ctx.fill()
    if (on) {
      ctx.fillStyle = 'rgba(255,82,82,0.25)'
      ctx.beginPath()
      ctx.arc(9 * TILE, 14, 14, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  if (zone.id === 'time') {
    // big wall clock with moving hands
    const cx = 9 * TILE
    const cy = 14
    ctx.fillStyle = '#fef3c7'
    ctx.beginPath()
    ctx.arc(cx, cy, 13, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#7c2d12'
    ctx.lineWidth = 3
    ctx.stroke()
    const aMin = t * 0.5
    const aHour = t * 0.05
    ctx.strokeStyle = '#1c1917'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(aMin) * 10, cy + Math.sin(aMin) * 10)
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(aHour) * 6, cy + Math.sin(aHour) * 6)
    ctx.stroke()
  }
  if (zone.id === 'robo') {
    // rotating gear
    ctx.save()
    ctx.translate(9 * TILE, 16)
    ctx.rotate(t * 0.8)
    ctx.font = '22px sans-serif'
    ctx.fillStyle = '#000'
    ctx.fillText('⚙️', 0, 0)
    ctx.restore()
  }
  if (zone.id === 'green') {
    // fluttering butterfly
    const bx = (4 + Math.sin(t * 0.7) * 3) * TILE
    const by = (6 + Math.cos(t * 1.1) * 2) * TILE
    ctx.font = '18px sans-serif'
    ctx.fillStyle = '#000'
    ctx.fillText('🦋', bx, by)
  }

  ctx.restore()
}
