import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { CardImagePlacement, ImagePosition, MediaDoc } from './media'

export type CityDoc = {
  id: string | number
  title?: string
  slug?: string
  region?: string
  summary?: string
  isPopular?: boolean
  sortOrder?: number
  coverImage?: MediaDoc | string | number | null
  imageSettings?: {
    cardImagePlacement?: CardImagePlacement
    objectPosition?: ImagePosition
  }
  meta?: {
    title?: string
    description?: string
  }
  createdAt?: string
  updatedAt?: string
}

export type EmbeddedPrice = {
  id?: string
  title?: string
  description?: string
  price?: number
  duration?: string
}

export type ParkDoc = {
  id: string | number
  title?: string
  slug?: string
  city?: CityDoc | string | number
  summary?: string
  description?: string
  cardImage?: MediaDoc | string | number | null
  gallery?: Array<MediaDoc | string | number>
  imageSettings?: {
    cardImagePlacement?: CardImagePlacement
    objectPosition?: ImagePosition
  }
  priceFrom?: number
  rating?: number
  cableTypes?: string[]
  features?: Record<string, boolean | undefined>
  prices?: EmbeddedPrice[]
  contacts?: {
    phone?: string
    website?: string
    vk?: string
    telegram?: string
  }
  location?: {
    address?: string
    district?: string
    yandexMapsUrl?: string
    lat?: number
    lng?: number
  }
  workTime?: string
  season?: string
  isVerified?: boolean
  isFeatured?: boolean
  isClaimed?: boolean
  dataQuality?: {
    lastCheckedAt?: string
    sourceUrl?: string
    freshnessNote?: string
    updatePriority?: 'low' | 'normal' | 'high'
  }
  status?: 'draft' | 'pending' | 'published' | 'archived'
  published?: boolean
  meta?: {
    title?: string
    description?: string
  }
  createdAt?: string
  updatedAt?: string
}

export type PriceDoc = {
  id: string | number
  park?: ParkDoc | string | number
  title?: string
  category?: 'wake' | 'training' | 'rent' | 'sup' | 'package' | 'other'
  description?: string
  price?: number
  weekdayPrice?: number
  weekendPrice?: number
  duration?: string
  sortOrder?: number
  status?: 'draft' | 'pending' | 'published' | 'archived'
  sourceNote?: string
}

export type ReviewDoc = {
  id: string | number
  park?: ParkDoc | string | number
  authorName?: string
  rating?: number
  text?: string
  visitedAt?: string
  source?: 'site' | 'vk' | 'yandex' | '2gis' | 'admin'
  status?: 'pending' | 'published' | 'rejected'
  isFeatured?: boolean
  createdAt?: string
}

const CITIES_COLLECTION = 'cities' as any
const PARKS_COLLECTION = 'parks' as any
const PRICES_COLLECTION = 'prices' as any
const REVIEWS_COLLECTION = 'reviews' as any

const publishedWhere = {
  or: [
    {
      status: {
        equals: 'published',
      },
    },
    {
      published: {
        equals: true,
      },
    },
  ],
}

type PayloadClient = Awaited<ReturnType<typeof getPayload>>

function normalizeRefId(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  return String(value)
}

export function getCityRefId(city: CityDoc | string | number | null | undefined): string | null {
  if (!city) return null
  if (typeof city === 'string' || typeof city === 'number') return normalizeRefId(city)
  return normalizeRefId(city.id)
}

export function getParkCityId(park: ParkDoc): string | null {
  return getCityRefId(park.city)
}

export function getCityTitle(city: CityDoc | string | number | null | undefined, fallback = 'Город не указан') {
  if (!city || typeof city === 'string' || typeof city === 'number') return fallback
  return city.title || fallback
}

export function getCitySlug(city: CityDoc | string | number | null | undefined): string | undefined {
  if (!city || typeof city === 'string' || typeof city === 'number') return undefined
  return city.slug || undefined
}

export function buildCityMap(cities: CityDoc[]): Map<string, CityDoc> {
  const map = new Map<string, CityDoc>()

  for (const city of cities) {
    const id = getCityRefId(city)
    if (id) map.set(id, city)
    if (city.slug) map.set(`slug:${city.slug}`, city)
  }

  return map
}

export function hydrateParkCity(park: ParkDoc, cityMap: Map<string, CityDoc>): ParkDoc {
  const cityId = getParkCityId(park)
  if (!cityId) return park

  const resolvedCity = cityMap.get(cityId)
  if (!resolvedCity) return park

  if (typeof park.city === 'object' && park.city) {
    return {
      ...park,
      city: {
        ...resolvedCity,
        ...park.city,
      },
    }
  }

  return {
    ...park,
    city: resolvedCity,
  }
}

export function hydrateParksWithCities(parks: ParkDoc[], cities: CityDoc[]): ParkDoc[] {
  const cityMap = buildCityMap(cities)
  return parks.map((park) => hydrateParkCity(park, cityMap))
}

export function countParksByCity(parks: ParkDoc[]): Map<string, number> {
  const counts = new Map<string, number>()

  for (const park of parks) {
    const cityId = getParkCityId(park)
    if (!cityId) continue
    counts.set(cityId, (counts.get(cityId) || 0) + 1)
  }

  return counts
}

async function findCities(payload: PayloadClient, limit = 1000): Promise<CityDoc[]> {
  const result = await payload.find({
    collection: CITIES_COLLECTION,
    depth: 1,
    limit,
    pagination: false,
    sort: 'sortOrder',
  })

  return result.docs as CityDoc[]
}

async function findCityById(payload: PayloadClient, cityId: string | number): Promise<CityDoc | null> {
  try {
    const result = await payload.findByID({
      collection: CITIES_COLLECTION,
      depth: 1,
      id: cityId,
    })

    return (result as CityDoc | undefined) || null
  } catch {
    return null
  }
}

export async function getCities(): Promise<CityDoc[]> {
  const payload = await getPayload({ config: configPromise })
  return findCities(payload)
}

export async function getCityBySlug(slug: string): Promise<CityDoc | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: CITIES_COLLECTION,
    depth: 1,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return (result.docs?.[0] as CityDoc | undefined) || null
}

export async function getParks(limit = 100): Promise<ParkDoc[]> {
  const payload = await getPayload({ config: configPromise })
  const [result, cities] = await Promise.all([
    payload.find({
      collection: PARKS_COLLECTION,
      depth: 2,
      limit,
      pagination: false,
      sort: '-isFeatured',
      where: publishedWhere,
    }),
    findCities(payload),
  ])

  return hydrateParksWithCities(result.docs as ParkDoc[], cities)
}

export async function getParksByCity(cityId: string | number): Promise<ParkDoc[]> {
  const payload = await getPayload({ config: configPromise })
  const city = await findCityById(payload, cityId)

  if (!city) return []

  // Важно: в Payload relationship-поле `city` в разных адаптерах/запросах может
  // фильтроваться нестабильно, особенно когда связь пришла как объект или как ID.
  // Поэтому для публичной страницы города берём опубликованные парки и фильтруем
  // по уже нормализованной связи в коде. Это надёжнее, чем `where: { city: { equals } }`.
  const parks = await getParks(1000)
  const targetCityId = normalizeRefId(city.id)
  const targetCitySlug = city.slug

  return parks.filter((park) => {
    const parkCityId = getParkCityId(park)
    const parkCitySlug = getCitySlug(park.city)

    if (targetCityId && parkCityId === targetCityId) return true
    if (targetCitySlug && parkCitySlug === targetCitySlug) return true

    return false
  })
}

export async function getParkBySlug(cityId: string | number, slug: string): Promise<ParkDoc | null> {
  const parks = await getParksByCity(cityId)
  return parks.find((park) => park.slug === slug) || null
}

export async function getPricesByPark(parkId: string | number, includePending = false): Promise<PriceDoc[]> {
  const payload = await getPayload({ config: configPromise })
  const where: any = {
    and: [
      {
        park: {
          equals: parkId,
        },
      },
    ],
  }

  if (!includePending) {
    where.and.push({
      status: {
        equals: 'published',
      },
    })
  }

  const result = await payload.find({
    collection: PRICES_COLLECTION,
    depth: 1,
    limit: 100,
    pagination: false,
    sort: 'sortOrder',
    where,
  })

  return result.docs as PriceDoc[]
}

export async function getReviewsByPark(parkId: string | number, limit = 20): Promise<ReviewDoc[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: REVIEWS_COLLECTION,
    depth: 1,
    limit,
    pagination: false,
    sort: '-createdAt',
    where: {
      and: [
        {
          park: {
            equals: parkId,
          },
        },
        {
          status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return result.docs as ReviewDoc[]
}

export function getCityFromPark(park: ParkDoc): CityDoc | null {
  if (!park.city || typeof park.city === 'string' || typeof park.city === 'number') return null
  return park.city
}

export function getParkHref(park: ParkDoc, fallback = '/wake-parks') {
  const city = getCityFromPark(park)
  if (!city?.slug || !park.slug) return fallback
  return `/wake-parks/${city.slug}/${park.slug}`
}

export type MapSettingsDoc = {
  provider?: 'schema' | 'yandex-js-api'
  yandexApiKey?: string
  showYandexEmbedFallback?: boolean
  defaultCenter?: {
    lat?: number
    lng?: number
  }
  defaultZoom?: number
}

export async function getMapSettings(): Promise<MapSettingsDoc> {
  const payload = await getPayload({ config: configPromise })

  try {
    const settings = await payload.findGlobal({
      slug: 'map-settings' as any,
      depth: 0,
    })

    return (settings || {}) as MapSettingsDoc
  } catch {
    return {
      provider: 'schema',
      showYandexEmbedFallback: true,
      defaultCenter: {
        lat: 55.751244,
        lng: 37.618423,
      },
      defaultZoom: 5,
    }
  }
}
