let ctx: AudioContext | null = null
let muted = false

export function setMuted(m: boolean) {
  muted = m
}
export function isMuted() {
  return muted
}

function ac(): AudioContext | null {
  if (muted) return null
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.06, when = 0) {
  const a = ac()
  if (!a) return
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(vol, a.currentTime + when)
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + when + dur)
  o.connect(g).connect(a.destination)
  o.start(a.currentTime + when)
  o.stop(a.currentTime + when + dur)
}

export const sfx = {
  click: () => tone(660, 0.06, 'square', 0.04),
  step: () => tone(180, 0.03, 'triangle', 0.015),
  coin: () => {
    tone(988, 0.08, 'square', 0.05)
    tone(1319, 0.15, 'square', 0.05, 0.07)
  },
  good: () => {
    tone(523, 0.1, 'square', 0.05)
    tone(659, 0.1, 'square', 0.05, 0.09)
    tone(784, 0.18, 'square', 0.05, 0.18)
  },
  bad: () => {
    tone(220, 0.18, 'sawtooth', 0.05)
    tone(165, 0.25, 'sawtooth', 0.05, 0.12)
  },
  badge: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, 'square', 0.05, i * 0.09))
  },
  enter: () => {
    tone(392, 0.08, 'triangle', 0.06)
    tone(587, 0.14, 'triangle', 0.06, 0.08)
  },
  robot: () => tone(440, 0.05, 'square', 0.04),
}
