// Pixel-art character rendering on canvas. Each character is drawn on a
// 12x16 logical pixel grid with uniform scaling, classic RPG-style.

export type Dir = 0 | 1 | 2 | 3 // up, right, down, left

export interface Palette {
  hair: string
  skin: string
  shirt: string
  pants: string
  shoes: string
}

export const PLAYER_PALETTES: Palette[] = [
  { hair: '#4a2c14', skin: '#f0c8a0', shirt: '#e04848', pants: '#3355aa', shoes: '#333333' },
  { hair: '#111111', skin: '#c98d5e', shirt: '#3f9e4d', pants: '#444455', shoes: '#222222' },
  { hair: '#d9a441', skin: '#f5d7b5', shirt: '#7a5fd0', pants: '#2f4858', shoes: '#333333' },
  { hair: '#7a3b10', skin: '#8d5a3b', shirt: '#e08e0b', pants: '#33415c', shoes: '#222222' },
]

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number, // top-left px of the box
  size: number,
  dir: Dir,
  walkFrame: number, // 0 or 1
  moving: boolean,
  p: Palette,
  tSec = 0,
  isPlayer = false,
) {
  const u = size / 12 // uniform logical pixel unit (grid: 12 wide, 16 tall)
  const frame = moving ? walkFrame : 0

  // gentle whole-body bob while walking; soft breathing when idle
  const bob = moving ? (frame === 1 ? -0.5 : 0) : Math.sin(tSec * 2.2) * 0.18

  // leg swing: how far each leg steps out
  // down/up: legs swing sideways; left/right: legs swing forward/back
  const swing = moving ? (frame === 0 ? 1 : -1) : 0

  const px = (gx: number, gy: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c
    ctx.fillRect(Math.round(x + gx * u), Math.round(y + (gy + bob) * u), Math.ceil(w * u), Math.ceil(h * u))
  }

  // shadow (doesn't bob)
  ctx.fillStyle = 'rgba(0,0,0,0.22)'
  ctx.beginPath()
  ctx.ellipse(x + size / 2, y + size * 1.3, size * 0.32, size * 0.09, 0, 0, Math.PI * 2)
  ctx.fill()

  const side = dir === 1 || dir === 3

  // ---- legs (bottom, y ~11.5–15) ----
  if (!moving) {
    px(3.5, 11.5, 2, 3.5, p.pants)
    px(6.5, 11.5, 2, 3.5, p.pants)
    px(3.2, 14.6, 2.5, 1.4, p.shoes)
    px(6.3, 14.6, 2.5, 1.4, p.shoes)
  } else if (side) {
    // legs step forward/back along x
    const fwd = dir === 1 ? 1 : -1
    px(5 + swing * fwd, 11.5, 2, 3.5, p.pants)
    px(5 - swing * fwd, 11.5, 2, 3.5, p.pants)
    px(4.8 + swing * fwd, 14.6, 2.5, 1.4, p.shoes)
    px(4.8 - swing * fwd, 14.6, 2.5, 1.4, p.shoes)
  } else {
    // legs step outward/inward
    px(3.5 - (swing > 0 ? 0.8 : 0), 11.5, 2, 3.5, p.pants)
    px(6.5 + (swing < 0 ? 0.8 : 0), 11.5, 2, 3.5, p.pants)
    px(3.2 - (swing > 0 ? 0.8 : 0), 14.6, 2.5, 1.4, p.shoes)
    px(6.3 + (swing < 0 ? 0.8 : 0), 14.6, 2.5, 1.4, p.shoes)
  }

  // ---- body (torso) ----
  px(2.8, 6.8, 6.4, 5, p.shirt)
  // collar
  px(4.5, 6.8, 3, 0.9, p.skin)
  // player backpack
  if (isPlayer) {
    if (dir === 0) {
      // full pack on the back
      px(3.6, 7.2, 4.8, 4.2, '#8d5a2b')
      px(4.6, 8.2, 2.8, 1.6, '#6d4420')
    } else {
      // straps
      px(3.6, 7.2, 1, 4, '#8d5a2b')
      px(7.4, 7.2, 1, 4, '#8d5a2b')
    }
  }

  // ---- arms (swing opposite to legs) ----
  const armSwing = moving ? -swing * 0.8 : 0
  if (side) {
    const fwd = dir === 1 ? 1 : -1
    px(4.2 + armSwing * fwd, 7.4, 1.6, 4, p.shirt)
    px(6.2 - armSwing * fwd, 7.4, 1.6, 4, p.shirt)
    px(4.2 + armSwing * fwd, 11, 1.6, 1.3, p.skin)
    px(6.2 - armSwing * fwd, 11, 1.6, 1.3, p.skin)
  } else {
    px(1.4, 7.4 + armSwing, 1.6, 4, p.shirt)
    px(9, 7.4 - armSwing, 1.6, 4, p.shirt)
    px(1.4, 11 + armSwing, 1.6, 1.3, p.skin)
    px(9, 11 - armSwing, 1.6, 1.3, p.skin)
  }

  // ---- head ----
  px(2.6, 0.6, 6.8, 6, p.skin)

  // hair
  if (dir === 0) {
    // back of head: full hair
    px(2.6, 0.6, 6.8, 5, p.hair)
  } else if (side) {
    px(2.6, 0.4, 6.8, 2.2, p.hair)
    // sideburn on the back side
    if (dir === 1) px(2.4, 1.6, 1.4, 3, p.hair)
    else px(8.2, 1.6, 1.4, 3, p.hair)
  } else {
    px(2.6, 0.4, 6.8, 2.2, p.hair)
    px(2.4, 1.6, 1.2, 2.6, p.hair)
    px(8.4, 1.6, 1.2, 2.6, p.hair)
  }
  // hair highlight
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.fillRect(Math.round(x + 3.4 * u), Math.round(y + (0.7 + bob) * u), Math.ceil(2.4 * u), Math.ceil(0.9 * u))

  // face
  if (dir === 2) {
    px(4, 3.2, 1.1, 1.3, '#1c1c2e')
    px(6.9, 3.2, 1.1, 1.3, '#1c1c2e')
    px(5, 5.2, 2, 0.7, '#b0663a')
  } else if (dir === 1) {
    px(6.9, 3.2, 1.1, 1.3, '#1c1c2e')
    px(7.4, 5.2, 1.4, 0.7, '#b0663a')
  } else if (dir === 3) {
    px(4, 3.2, 1.1, 1.3, '#1c1c2e')
    px(3.2, 5.2, 1.4, 0.7, '#b0663a')
  }
}
