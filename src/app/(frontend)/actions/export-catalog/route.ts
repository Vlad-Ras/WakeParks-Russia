import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

const CITIES_COLLECTION = 'cities' as any
const PARKS_COLLECTION = 'parks' as any
const PRICES_COLLECTION = 'prices' as any

export async function GET(request: Request) {
  const url = new URL(request.url)
  const format = (url.searchParams.get('format') || 'json').toLowerCase()
  const includeDrafts = url.searchParams.get('includeDrafts') === '1'

  const payload = await getPayload({ config: configPromise })
  const [citiesResult, parksResult, pricesResult] = await Promise.all([
    payload.find({ collection: CITIES_COLLECTION, depth: 0, limit: 1000, pagination: false, sort: 'sortOrder' }),
    payload.find({
      collection: PARKS_COLLECTION,
      depth: 1,
      limit: 5000,
      pagination: false,
      sort: 'title',
      where: includeDrafts
        ? undefined
        : {
            or: [{ status: { equals: 'published' } }, { published: { equals: true } }],
          },
    }),
    payload.find({
      collection: PRICES_COLLECTION,
      depth: 1,
      limit: 10000,
      pagination: false,
      sort: 'sortOrder',
      where: includeDrafts ? undefined : { status: { equals: 'published' } },
    }),
  ])

  const cities = citiesResult.docs.map(normalizeCity)
  const cityById = new Map(cities.map((city) => [String(city.id), city]))
  const parks = parksResult.docs.map((park) => normalizePark(park, cityById))
  const prices = pricesResult.docs.map(normalizePrice)

  if (format === 'csv') {
    return new Response(toCsv(parks, cities), {
      headers: {
        'Content-Disposition': 'attachment; filename="wakeparks-export.csv"',
        'Content-Type': 'text/csv; charset=utf-8',
      },
    })
  }

  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      version: 1,
      cities,
      parks,
      prices,
    },
    {
      headers: {
        'Content-Disposition': 'attachment; filename="wakeparks-export.json"',
      },
    },
  )
}

function normalizeCity(city: any) {
  return {
    id: city.id,
    title: city.title || '',
    slug: city.slug || '',
    region: city.region || '',
    summary: city.summary || '',
    isPopular: Boolean(city.isPopular),
    sortOrder: city.sortOrder ?? 100,
    coordinates: city.coordinates || {},
    meta: city.meta || {},
  }
}

function normalizePark(park: any, cityById: Map<string, ReturnType<typeof normalizeCity>>) {
  const city = typeof park.city === 'object' && park.city ? park.city : cityById.get(String(park.city || ''))

  return {
    id: park.id,
    title: park.title || '',
    slug: park.slug || '',
    citySlug: city?.slug || '',
    cityTitle: city?.title || '',
    status: park.status || (park.published ? 'published' : 'draft'),
    summary: park.summary || '',
    description: park.description || '',
    priceFrom: park.priceFrom ?? '',
    rating: park.rating ?? '',
    cableTypes: park.cableTypes || [],
    features: park.features || {},
    contacts: park.contacts || {},
    location: park.location || {},
    workTime: park.workTime || '',
    season: park.season || '',
    isVerified: Boolean(park.isVerified),
    isFeatured: Boolean(park.isFeatured),
    isClaimed: Boolean(park.isClaimed),
    dataQuality: park.dataQuality || {},
    meta: park.meta || {},
  }
}

function normalizePrice(price: any) {
  const park = typeof price.park === 'object' && price.park ? price.park : null

  return {
    id: price.id,
    parkSlug: park?.slug || '',
    parkTitle: park?.title || '',
    title: price.title || '',
    category: price.category || 'other',
    description: price.description || '',
    price: price.price ?? '',
    weekdayPrice: price.weekdayPrice ?? '',
    weekendPrice: price.weekendPrice ?? '',
    duration: price.duration || '',
    sortOrder: price.sortOrder ?? 100,
    status: price.status || 'published',
    sourceNote: price.sourceNote || '',
  }
}

function toCsv(parks: ReturnType<typeof normalizePark>[], cities: ReturnType<typeof normalizeCity>[]) {
  const cityBySlug = new Map(cities.map((city) => [city.slug, city]))
  const rows = [
    [
      'citySlug',
      'cityTitle',
      'region',
      'parkSlug',
      'parkTitle',
      'status',
      'summary',
      'address',
      'district',
      'priceFrom',
      'rating',
      'phone',
      'website',
      'vk',
      'telegram',
      'yandexMapsUrl',
      'workTime',
      'season',
      'lat',
      'lng',
      'cableTypes',
      'features',
    ],
    ...parks.map((park) => {
      const city = cityBySlug.get(park.citySlug)
      const activeFeatures = Object.entries(park.features || {})
        .filter(([, enabled]) => Boolean(enabled))
        .map(([key]) => key)

      return [
        park.citySlug,
        park.cityTitle,
        city?.region || '',
        park.slug,
        park.title,
        park.status,
        park.summary,
        park.location?.address || '',
        park.location?.district || '',
        park.priceFrom,
        park.rating,
        park.contacts?.phone || '',
        park.contacts?.website || '',
        park.contacts?.vk || '',
        park.contacts?.telegram || '',
        park.location?.yandexMapsUrl || '',
        park.workTime,
        park.season,
        park.location?.lat || '',
        park.location?.lng || '',
        (park.cableTypes || []).join('|'),
        activeFeatures.join('|'),
      ]
    }),
  ]

  return rows.map((row) => row.map(csvCell).join(',')).join('\n')
}

function csvCell(value: unknown) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}
