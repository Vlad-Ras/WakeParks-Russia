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

export async function getCities(): Promise<CityDoc[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: CITIES_COLLECTION,
    depth: 1,
    limit: 100,
    pagination: false,
    sort: 'sortOrder',
  })

  return result.docs as CityDoc[]
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
  const result = await payload.find({
    collection: PARKS_COLLECTION,
    depth: 1,
    limit,
    pagination: false,
    sort: '-isFeatured',
    where: publishedWhere,
  })

  return result.docs as ParkDoc[]
}

export async function getParksByCity(cityId: string | number): Promise<ParkDoc[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: PARKS_COLLECTION,
    depth: 1,
    limit: 100,
    pagination: false,
    sort: '-isFeatured',
    where: {
      and: [
        {
          city: {
            equals: cityId,
          },
        },
        publishedWhere,
      ],
    },
  })

  return result.docs as ParkDoc[]
}

export async function getParkBySlug(cityId: string | number, slug: string): Promise<ParkDoc | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: PARKS_COLLECTION,
    depth: 1,
    limit: 1,
    pagination: false,
    where: {
      and: [
        {
          city: {
            equals: cityId,
          },
        },
        {
          slug: {
            equals: slug,
          },
        },
        publishedWhere,
      ],
    },
  })

  return (result.docs?.[0] as ParkDoc | undefined) || null
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
