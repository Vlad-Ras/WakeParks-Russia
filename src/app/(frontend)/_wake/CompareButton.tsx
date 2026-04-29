'use client'

import { useEffect, useState } from 'react'

import type { FavoriteParkSnapshot } from './FavoriteButton'

const STORAGE_KEY = 'wakeparks:compare'
const MAX_COMPARE_ITEMS = 4

export type CompareParkSnapshot = FavoriteParkSnapshot

export function CompareButton({ park, compact = false }: { park: CompareParkSnapshot; compact?: boolean }) {
  const [isSelected, setIsSelected] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isLimitReached, setIsLimitReached] = useState(false)

  useEffect(() => {
    const items = readCompareParks()
    setIsSelected(items.some((item) => item.id === park.id))
    setIsLimitReached(items.length >= MAX_COMPARE_ITEMS && !items.some((item) => item.id === park.id))
    setIsReady(true)
  }, [park.id])

  function toggleCompare() {
    const items = readCompareParks()
    const exists = items.some((item) => item.id === park.id)
    const nextItems = exists ? items.filter((item) => item.id !== park.id) : [park, ...items].slice(0, MAX_COMPARE_ITEMS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems))
    setIsSelected(!exists)
    setIsLimitReached(nextItems.length >= MAX_COMPARE_ITEMS && exists)
    window.dispatchEvent(new CustomEvent('wakeparks:compare-updated'))
  }

  const disabled = isReady && !isSelected && isLimitReached

  return (
    <button
      className={
        compact
          ? 'rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50'
          : 'rounded-full border border-border px-5 py-3 text-sm font-medium transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50'
      }
      disabled={disabled}
      onClick={toggleCompare}
      title={disabled ? `Можно сравнить максимум ${MAX_COMPARE_ITEMS} парка` : undefined}
      type="button"
    >
      {!isReady ? 'Сравнить' : isSelected ? 'В сравнении ✓' : disabled ? 'Лимит сравнения' : 'Сравнить'}
    </button>
  )
}

export function readCompareParks(): CompareParkSnapshot[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isCompareParkSnapshot).slice(0, MAX_COMPARE_ITEMS)
  } catch {
    return []
  }
}

export function removeComparePark(id: string) {
  const nextItems = readCompareParks().filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems))
  window.dispatchEvent(new CustomEvent('wakeparks:compare-updated'))
}

export function clearCompareParks() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('wakeparks:compare-updated'))
}

function isCompareParkSnapshot(value: unknown): value is CompareParkSnapshot {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<CompareParkSnapshot>
  return typeof item.id === 'string' && typeof item.title === 'string' && typeof item.href === 'string'
}
