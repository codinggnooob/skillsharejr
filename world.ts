import { ZONES } from './zones'
import type { Zone } from './types'

export const TILE = 36
export const MAP_W = 64
export const MAP_H = 44

export type Ground = 'grass' | 'road' | 'water' | 'plaza'

interface Decor {
  x: number
  y: number
  kind: 'tree' | 'flower' | 'rock' | 'shroom'
  seed: number
}

// Deterministic pseudo-random from coordinates
export function hash(x: number, y: number, s = 0): number {
  let h = x * 374761393 + y * 668265263 + s * 2246822519
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) >>> 0) / 4294967295
}

export const ground: Ground[][] = []
export const decor: Decor[] = []
const blockedSet = new Set<string>()

export const key = (x: number, y: number) => `${x},${y}`

const ROADS_X = [20, 21, 44, 45]
const ROADS_Y = [14, 15, 27, 28]
const POND = { x: 24, y: 20, rx: 4.5, ry: 3 }
const FOUNTAIN = { x: 40, y: 21 } // center of tile

function initMap() {
  for (let y = 0; y < MAP_H; y++) {
    const row: Ground[] = []
    for (let x = 0; x < MAP_W; x++) {
      let g: Ground = 'grass'
      if (ROADS_X.includes(x) || ROADS_Y.includes(y)) g = 'road'
      const dx = (x + 0.5 - POND.x) / POND.rx
      const dy = (y + 0.5 - POND.y) / POND.ry
      if (dx * dx + dy * dy < 1) g = 'water'
      row.push(g)
    }
    ground.push(row)
  }

  // buildings blocked
  for (const z of ZONES) {
    for (let y = z.y; y < z.y + z.h; y++)
      for (let x = z.x; x < z.x + z.w; x++) blockedSet.add(key(x, y))
  }
  // water blocked
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) if (ground[y][x] === 'water') blockedSet.add(key(x, y))
  // fountain blocked
  blockedSet.add(key(FOUNTAIN.x, FOUNTAIN.y))

  // map border fence
  for (let x = 0; x < MAP_W; x++) {
    blockedSet.add(key(x, 0))
    blockedSet.add(key(x, MAP_H - 1))
  }
  for (let y = 0; y < MAP_H; y++) {
    blockedSet.add(key(0, y))
    blockedSet.add(key(MAP_W - 1, y))
  }

  // decor scatter
  for (let y = 1; y < MAP_H - 1; y++) {
    for (let x = 1; x < MAP_W - 1; x++) {
      if (ground[y][x] !== 'grass') continue
      if (blockedSet.has(key(x, y))) continue
      // keep door fronts clear
      const nearDoor = ZONES.some((z) => Math.abs(x - (z.x + 4)) <= 1 && y >= z.y + z.h && y <= z.y + z.h + 2)
      if (nearDoor) continue
      const r = hash(x, y, 7)
      if (r < 0.055) {
        decor.push({ x, y, kind: 'tree', seed: r * 1000 })
        blockedSet.add(key(x, y))
      } else if (r < 0.1) {
        decor.push({ x, y, kind: 'flower', seed: r * 1000 })
      } else if (r < 0.108) {
        decor.push({ x, y, kind: 'rock', seed: r * 1000 })
        blockedSet.add(key(x, y))
      } else if (r < 0.113) {
        decor.push({ x, y, kind: 'shroom', seed: r * 1000 })
      }
    }
  }
}
initMap()

export function isBlocked(tx: number, ty: number): boolean {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true
  return blockedSet.has(key(tx, ty))
}

// AABB vs blocked tiles. px,py = top-left, w,h in pixels.
export function collides(px: number, py: number, w: number, h: number): boolean {
  const x0 = Math.floor(px / TILE)
  const y0 = Math.floor(py / TILE)
  const x1 = Math.floor((px + w - 1) / TILE)
  const y1 = Math.floor((py + h - 1) / TILE)
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (isBlocked(x, y)) return true
  return false
}

export function doorTile(z: Zone): { x: number; y: number } {
  return { x: z.x + Math.floor(z.w / 2), y: z.y + z.h - 1 }
}

export function doorFront(z: Zone): { x: number; y: number } {
  return { x: z.x + Math.floor(z.w / 2), y: z.y + z.h }
}

/* ------------------------------- rendering ------------------------------ */

const GRASS_A = '#5cb860'
const GRASS_B = '#54ae58'
const ROAD_A = '#c9b18c'
const ROAD_B = '#bfa87f'

function drawGround(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const g = ground[y][x]
  const sx = x * TILE
  const sy = y * TILE
  if (g === 'grass') {
    ctx.fillStyle = (x + y) % 2 === 0 ? GRASS_A : GRASS_B
    ctx.fillRect(sx, sy, TILE, TILE)
    const r = hash(x, y, 3)
    if (r < 0.3) {
      ctx.fillStyle = '#4a9e50'
      const ox = Math.floor(r * 100) % 3
      ctx.fillRect(sx + 4 + ox * 10, sy + 6 + (Math.floor(r * 1000) % 2) * 14, 3, 6)
      ctx.fillRect(sx + 8 + ox * 10, sy + 4 + (Math.floor(r * 1000) % 2) * 14, 3, 6)
    }
  } else if (g === 'road') {
    ctx.fillStyle = (x + y) % 2 === 0 ? ROAD_A : ROAD_B
    ctx.fillRect(sx, sy, TILE, TILE)
    const r = hash(x, y, 5)
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    if (r < 0.5) ctx.fillRect(sx + 6, sy + 8, 5, 4)
    if (r > 0.4) ctx.fillRect(sx + 22, sy + 22, 6, 4)
  } else if (g === 'water') {
    ctx.fillStyle = '#3d8fd1'
    ctx.fillRect(sx, sy, TILE, TILE)
    const w = Math.floor(t * 2 + x + y) % 3
    ctx.fillStyle = '#63b3e8'
    ctx.fillRect(sx + ((x * 13 + w * 9) % 24), sy + 8, 10, 3)
    ctx.fillRect(sx + ((x * 7 + y * 5 + w * 6) % 22), sy + 22, 8, 3)
  }
}

function drawTree(ctx: CanvasRenderingContext2D, sx: number, sy: number, seed: number) {
  const sway = Math.sin(seed + performance.now() / 900) * 1.2
  ctx.fillStyle = '#7a4a21'
  ctx.fillRect(sx + 14, sy + 18, 8, 16)
  ctx.fillStyle = '#2e7d32'
  ctx.fillRect(sx + 2 + sway, sy - 4, 32, 14)
  ctx.fillRect(sx - 2 + sway, sy + 4, 40, 12)
  ctx.fillRect(sx + 5 + sway, sy + 14, 26, 8)
  ctx.fillStyle = '#43a047'
  ctx.fillRect(sx + 6 + sway, sy - 2, 10, 8)
  ctx.fillRect(sx + 20 + sway, sy + 6, 8, 6)
}

function drawDecor(ctx: CanvasRenderingContext2D, d: Decor) {
  const sx = d.x * TILE
  const sy = d.y * TILE
  if (d.kind === 'tree') {
    drawTree(ctx, sx, sy, d.seed)
  } else if (d.kind === 'flower') {
    const colors = ['#ef5350', '#ffee58', '#ba68c8', '#ffffff']
    const c = colors[Math.floor(d.seed * 10) % colors.length]
    ctx.fillStyle = '#388e3c'
    ctx.fillRect(sx + 16, sy + 18, 3, 10)
    ctx.fillStyle = c
    ctx.fillRect(sx + 12, sy + 12, 11, 8)
    ctx.fillStyle = '#fff9c4'
    ctx.fillRect(sx + 15, sy + 14, 4, 4)
  } else if (d.kind === 'rock') {
    ctx.fillStyle = '#9e9e9e'
    ctx.fillRect(sx + 8, sy + 16, 20, 12)
    ctx.fillStyle = '#bdbdbd'
    ctx.fillRect(sx + 10, sy + 18, 8, 5)
  } else {
    ctx.fillStyle = '#f5f0e6'
    ctx.fillRect(sx + 15, sy + 18, 6, 8)
    ctx.fillStyle = '#d32f2f'
    ctx.fillRect(sx + 11, sy + 12, 14, 8)
  }
}

function drawBuilding(ctx: CanvasRenderingContext2D, z: Zone, t: number, near: boolean, badge: string | undefined) {
  const sx = z.x * TILE
  const sy = z.y * TILE
  const w = z.w * TILE
  const h = z.h * TILE
  const roofH = TILE * 1.6

  // ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.fillRect(sx + 6, sy + h - 6, w - 4, 12)

  // walls
  ctx.fillStyle = '#f2e4c4'
  ctx.fillRect(sx + 4, sy + roofH, w - 8, h - roofH)
  ctx.fillStyle = '#e3d1a8'
  ctx.fillRect(sx + 4, sy + h - 12, w - 8, 12)

  // roof
  ctx.fillStyle = z.color
  ctx.fillRect(sx, sy, w, roofH * 0.55)
  ctx.fillRect(sx + 8, sy + roofH * 0.55, w - 16, roofH * 0.45)
  ctx.fillStyle = z.dark
  ctx.fillRect(sx, sy, w, 6)
  ctx.fillRect(sx, sy + roofH - 8, w, 8)

  // windows (2 rows x N)
  const cols = Math.floor(z.w / 2)
  for (let i = 0; i < cols; i++) {
    const wx = sx + 14 + i * ((w - 28) / Math.max(cols - 1, 1))
    for (const wy of [sy + roofH + 12, sy + roofH + 52]) {
      if (wy + 24 > sy + h - 18) continue
      ctx.fillStyle = z.dark
      ctx.fillRect(wx - 3, wy - 3, 26, 26)
      ctx.fillStyle = '#bfe7ff'
      ctx.fillRect(wx, wy, 20, 20)
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.fillRect(wx + 2, wy + 2, 7, 7)
    }
  }

  // door
  const doorW = 30
  const dx = sx + w / 2 - doorW / 2
  const dy = sy + h - 40
  ctx.fillStyle = z.dark
  ctx.fillRect(dx - 4, dy - 4, doorW + 8, 44)
  ctx.fillStyle = '#6d4c2f'
  ctx.fillRect(dx, dy, doorW, 40)
  ctx.fillStyle = '#ffd54f'
  ctx.fillRect(dx + doorW - 8, dy + 20, 5, 5)

  // pulsing door marker
  if (near) {
    const pulse = (Math.sin(t * 5) + 1) / 2
    ctx.fillStyle = `rgba(255, 235, 130, ${0.55 + pulse * 0.45})`
    const cy = sy + h + 8
    ctx.beginPath()
    ctx.moveTo(sx + w / 2 - 12, cy + 10)
    ctx.lineTo(sx + w / 2 + 12, cy + 10)
    ctx.lineTo(sx + w / 2, cy - 2 - pulse * 4)
    ctx.closePath()
    ctx.fill()
  }

  // sign
  const signW = Math.min(w - 20, 220)
  const signH = 34
  const signX = sx + w / 2 - signW / 2
  const signY = sy + roofH - 6
  ctx.fillStyle = '#3e2723'
  ctx.fillRect(signX - 4, signY - 4, signW + 8, signH + 8)
  ctx.fillStyle = '#5d4037'
  ctx.fillRect(signX, signY, signW, signH)
  ctx.font = '22px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(z.icon, signX + 10, signY + signH / 2 + 1)
  ctx.font = 'bold 15px "Press Start 2P", monospace'
  ctx.fillStyle = '#ffe082'
  const label = z.name.toUpperCase()
  ctx.font = label.length > 12 ? '9px "Press Start 2P", monospace' : '11px "Press Start 2P", monospace'
  ctx.fillText(label, signX + 40, signY + signH / 2 + 1)

  // badge flag on roof
  if (badge) {
    const colors: Record<string, string> = { bronze: '#b0783c', silver: '#c0c8d0', gold: '#ffd54f' }
    ctx.fillStyle = colors[badge]
    ctx.fillRect(sx + w - 26, sy + 8, 14, 18)
    ctx.fillStyle = '#3e2723'
    ctx.fillRect(sx + w - 26, sy + 8, 14, 3)
  }
}

function drawFountain(ctx: CanvasRenderingContext2D, t: number) {
  const sx = FOUNTAIN.x * TILE
  const sy = FOUNTAIN.y * TILE
  ctx.fillStyle = '#90a4ae'
  ctx.fillRect(sx - 8, sy + 4, TILE + 16, TILE - 2)
  ctx.fillStyle = '#4fc3f7'
  ctx.fillRect(sx - 2, sy + 10, TILE + 4, TILE - 14)
  const h = 8 + Math.sin(t * 3) * 4
  ctx.fillStyle = '#b3e5fc'
  ctx.fillRect(sx + 14, sy + 8 - h, 8, h + 8)
}

export interface Camera {
  x: number
  y: number
}

export function renderWorld(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  vw: number,
  vh: number,
  t: number,
  nearZone: Zone | null,
  badges: Record<string, string | undefined>,
) {
  const x0 = Math.max(0, Math.floor(cam.x / TILE) - 1)
  const y0 = Math.max(0, Math.floor(cam.y / TILE) - 1)
  const x1 = Math.min(MAP_W - 1, Math.ceil((cam.x + vw) / TILE) + 1)
  const y1 = Math.min(MAP_H - 1, Math.ceil((cam.y + vh) / TILE) + 1)

  ctx.save()
  ctx.translate(-cam.x, -cam.y)

  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) drawGround(ctx, x, y, t)

  // border fence
  ctx.fillStyle = '#8d6e63'
  for (let x = x0; x <= x1; x++) {
    ctx.fillRect(x * TILE, 10, TILE, 8)
    ctx.fillRect(x * TILE, (MAP_H - 1) * TILE + 20, TILE, 8)
  }

  drawFountain(ctx, t)

  // path from roads to doors
  ctx.fillStyle = ROAD_A
  for (const z of ZONES) {
    const d = doorTile(z)
    ctx.fillRect(d.x * TILE, (z.y + z.h) * TILE, TILE, TILE)
  }

  for (const d of decor) {
    if (d.x < x0 || d.x > x1 || d.y < y0 || d.y > y1) continue
    drawDecor(ctx, d)
  }

  for (const z of ZONES) {
    if (z.x > x1 + z.w || z.x + z.w < x0 - z.w) continue
    drawBuilding(ctx, z, t, nearZone?.id === z.id, badges[z.id])
    // sparkles above badge-earned academies
    if (badges[z.id]) {
      for (let i = 0; i < 3; i++) {
        const sx = (z.x + 1.5 + i * 3) * TILE
        const sy = z.y * TILE - 8 - ((t * 40 + i * 30) % 50)
        const a = 1 - ((t * 40 + i * 30) % 50) / 50
        ctx.fillStyle = `rgba(255,235,130,${a})`
        ctx.fillRect(sx, sy, 4, 4)
        ctx.fillRect(sx - 2, sy + 1, 8, 2)
        ctx.fillRect(sx + 1, sy - 2, 2, 8)
      }
    }
  }

  // drifting cloud shadows
  ctx.fillStyle = 'rgba(20,40,80,0.07)'
  for (let i = 0; i < 3; i++) {
    const cx = ((t * 14 + i * 700) % (MAP_W * TILE + 800)) - 400
    const cy = (6 + i * 13) * TILE
    ctx.beginPath()
    ctx.ellipse(cx, cy, 260, 110, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // butterflies
  for (let i = 0; i < 3; i++) {
    const bx = (10 + i * 17 + Math.sin(t * 0.5 + i * 2) * 5) * TILE
    const by = (8 + i * 9 + Math.cos(t * 0.8 + i) * 4) * TILE
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#000'
    ctx.fillText('🦋', bx, by)
  }

  ctx.restore()
}
