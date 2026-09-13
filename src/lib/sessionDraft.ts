import type { AppView, CardColor } from './types'

const STORAGE_KEY = 'cmiygl-draft'

export type IdDraft = {
  introOpen: boolean
  introRemoved: boolean
  view: AppView
  color: CardColor
  photo: string
  name: string
  dob: string
  location: string
  signature: string
}

const defaults: IdDraft = {
  introOpen: true,
  introRemoved: false,
  view: 'form',
  color: 'yellow',
  photo: '',
  name: '',
  dob: '',
  location: '',
  signature: '',
}

export function loadDraft(): IdDraft {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<IdDraft>
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

export function saveDraft(draft: IdDraft) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // Quota or private mode — ignore
  }
}

export function clearDraft() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
