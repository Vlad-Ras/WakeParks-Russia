import type { ParkDoc } from './queries'

export type RankedPark = {
  park: ParkDoc
  score: number
  reasons: string[]
}

export function getParkScore(park: ParkDoc): RankedPark {
  let score = 0
  const reasons: string[] = []

  if (park.isFeatured) {
    score += 20
    reasons.push('парк отмечен как рекомендуемый')
  }

  if (park.isVerified) {
    score += 16
    reasons.push('карточка проверена')
  }

  if (park.isClaimed) {
    score += 16
    reasons.push('карточка подтверждена владельцем')
  }

  if (park.rating) {
    score += Math.round(Math.min(5, Math.max(0, park.rating)) * 10)
    reasons.push(`рейтинг ${park.rating}`)
  }

  if (park.cardImage || park.gallery?.length) {
    score += 8
    reasons.push('есть фото')
  }

  if (park.priceFrom) {
    score += 6
    reasons.push('указана цена')
  }

  if (park.contacts?.phone || park.contacts?.website || park.contacts?.vk || park.contacts?.telegram) {
    score += 8
    reasons.push('есть контакты')
  }

  if (park.location?.address || park.location?.yandexMapsUrl) {
    score += 6
    reasons.push('есть адрес или маршрут')
  }

  if (park.dataQuality?.lastCheckedAt) {
    const freshness = getFreshnessInfo(park.dataQuality.lastCheckedAt)
    score += freshness.scoreBonus
    reasons.push(freshness.reason)
  }

  const featuresCount = Object.values(park.features || {}).filter(Boolean).length
  if (featuresCount) {
    score += Math.min(10, featuresCount * 2)
    reasons.push(`${featuresCount} услуг/параметров`)
  }

  return {
    park,
    score,
    reasons: reasons.slice(0, 5),
  }
}

export function sortBestParks(parks: ParkDoc[]): RankedPark[] {
  return parks
    .map(getParkScore)
    .sort((a, b) => b.score - a.score || (b.park.rating || 0) - (a.park.rating || 0))
}

export function sortNewestParks(parks: ParkDoc[]): ParkDoc[] {
  return [...parks].sort((a, b) => toTime(b.createdAt || b.updatedAt) - toTime(a.createdAt || a.updatedAt))
}

export function sortRecentlyUpdatedParks(parks: ParkDoc[]): ParkDoc[] {
  return [...parks].sort((a, b) => {
    const aChecked = a.dataQuality?.lastCheckedAt || a.updatedAt || a.createdAt
    const bChecked = b.dataQuality?.lastCheckedAt || b.updatedAt || b.createdAt
    return toTime(bChecked) - toTime(aChecked)
  })
}

export function getFreshnessInfo(value?: string) {
  if (!value) {
    return {
      label: 'Не проверено',
      tone: 'muted' as const,
      scoreBonus: 0,
      reason: 'дату проверки ещё нужно указать',
    }
  }

  const days = daysSince(value)

  if (days <= 30) {
    return {
      label: 'Свежие данные',
      tone: 'good' as const,
      scoreBonus: 12,
      reason: 'данные проверены за последние 30 дней',
    }
  }

  if (days <= 90) {
    return {
      label: 'Проверено недавно',
      tone: 'ok' as const,
      scoreBonus: 8,
      reason: 'данные проверены за последние 3 месяца',
    }
  }

  if (days <= 180) {
    return {
      label: 'Нужна перепроверка',
      tone: 'warn' as const,
      scoreBonus: 2,
      reason: 'данные старше 3 месяцев',
    }
  }

  return {
    label: 'Устаревшие данные',
    tone: 'bad' as const,
    scoreBonus: 0,
    reason: 'данные давно не проверялись',
  }
}

export function formatDate(value?: string) {
  if (!value) return 'не указано'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ru-RU')
}

function daysSince(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return Number.MAX_SAFE_INTEGER
  const ms = Date.now() - date.getTime()
  return Math.max(0, Math.floor(ms / 86_400_000))
}

function toTime(value?: string) {
  if (!value) return 0
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}
