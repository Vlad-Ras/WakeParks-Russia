'use client'

import { useEffect, useState } from 'react'

export type FavoriteParkSnapshot = {
  id: string
  title: string
  cityTitle?: string
  citySlug?: string
  parkSlug?: string
  summary?: string
  priceFrom?: number | null
  rating?: number | null
  address?: string
  cableTypes?: string[]
  features?: string[]
  href: string
}

const STORAGE_KEY = 'wakeparks:favorites'

export function FavoriteButton({ park, compact = false }: { park: FavoriteParkSnapshot; compact?: boolean }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsFavorite(readFavorites().some((item) => item.id === park.id))
    setIsReady(true)
  }, [park.id])

  function toggleFavorite() {
    const favorites = readFavorites()
    const exists = favorites.some((item) => item.id === park.id)
    const nextFavorites = exists ? favorites.filter((item) => item.id !== park.id) : [park, ...favorites]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites.slice(0, 100)))
    setIsFavorite(!exists)
    window.dispatchEvent(new CustomEvent('wakeparks:favorites-updated'))
  }

  return (
    <button
      className={
        compact
          ? 'rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary'
          : 'rounded-full border border-border px-5 py-3 text-sm font-medium transition hover:bg-secondary'
      }
      onClick={toggleFavorite}
      type="button"
    >
      {!isReady ? 'В избранное' : isFavorite ? 'В избранном ✓' : 'В избранное'}
    </button>
  )
}

export function readFavorites(): FavoriteParkSnapshot[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isFavoriteParkSnapshot)
  } catch {
    return []
  }
}

export function removeFavorite(id: string) {
  const nextFavorites = readFavorites().filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites))
  window.dispatchEvent(new CustomEvent('wakeparks:favorites-updated'))
}

export function clearFavorites() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('wakeparks:favorites-updated'))
}

function isFavoriteParkSnapshot(value: unknown): value is FavoriteParkSnapshot {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<FavoriteParkSnapshot>
  return typeof item.id === 'string' && typeof item.title === 'string' && typeof item.href === 'string'
}
