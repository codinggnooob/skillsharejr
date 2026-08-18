export type AgeGroup = 'sprout' | 'explorer' | 'trailblazer'

export const AGE_LABELS: Record<AgeGroup, string> = {
  sprout: 'Sprout (7-10)',
  explorer: 'Explorer (11-14)',
  trailblazer: 'Trailblazer (15-18)',
}

export type ZoneId =
  | 'bank'
  | 'safety'
  | 'robo'
  | 'code'
  | 'ai'
  | 'media'
  | 'wellness'
  | 'time'
  | 'green'

export interface ZoneNPC {
  name: string
  role: string
  emoji: string
  palette: number
  intro: string[]
  prompt: string
  congrats: string
}

export interface Zone {
  id: ZoneId
  name: string
  skill: string
  tagline: string
  icon: string
  color: string
  dark: string
  x: number
  y: number
  w: number
  h: number
  learnings: string[]
  npc: ZoneNPC
}

export type BadgeTier = 'bronze' | 'silver' | 'gold'

export interface Progress {
  name: string
  ageGroup: AgeGroup
  xp: number
  coins: number
  badges: Partial<Record<ZoneId, BadgeTier>>
  introSeen?: boolean
  met?: string[]
  celebrated?: boolean
}

export interface QuizQ {
  q: string
  options: string[]
  answer: number
  explain: string
}

export interface SortItem {
  label: string
  icon: string
  bucket: number
}

export interface SortChallenge {
  title: string
  instruction: string
  buckets: { name: string; icon: string; color: string }[]
  items: SortItem[]
}

export interface PickItem {
  label: string
  icon: string
  good: boolean
  why: string
}

export interface PickChallenge {
  title: string
  instruction: string
  slots: number
  items: PickItem[]
}

export const badgeForScore = (score: number): BadgeTier | null =>
  score >= 90 ? 'gold' : score >= 70 ? 'silver' : score >= 50 ? 'bronze' : null

export const BADGE_ORDER: BadgeTier[] = ['bronze', 'silver', 'gold']
