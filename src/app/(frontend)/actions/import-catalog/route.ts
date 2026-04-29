import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

const CITIES_COLLECTION = 'cities' as any
const PARKS_COLLECTION = 'parks' as any
const PRICES_COLLECTION = 'prices' as any

const allowedStatuses = new Set(['draft', 'pending', 'published', 'archived'])
const allowedPriceCategories = new Set(['wake', 'training', 'rent', 'sup', 'package', 'other'])

export async function POST(request: Request) {
  try {
    const expectedToken = process.env.WAKE_ADMIN_TOKEN
    const providedToken = request.headers.get('x-wake-admin-token') || ''

    if (!expectedToken) {
      return NextResponse.json(
        {
          error:
            'Импорт отключён. Добавь WAKE_ADMIN_TOKEN в .env.local или .env, перезапусти pnpm dev и повтори импорт.',
        },
        { status: 403 },
      )
    }

    if (providedToken !== expectedToken) {
      return NextResponse.json({ error: 'Неверный токен импорта.' }, { status: 401 })
    }

    const body = await request.json()
    const mode = body?.mode === 'dryRun' ? 'dryRun' : 'import'
    const citiesInput = Array.isArray(body?.cities) ? body.cities : []
    const parksInput = Array.isArray(body?.parks) ? body.parks : []
    const pricesInput = Array.isArray(body?.prices) ? body.prices : []

    const summary = {
      mode,
      citiesToCreate: 0,
      citiesToUpdate: 0,
      parksToCreate: 0,
      parksToUpdate: 0,
      pricesToCreate: 0,
      skipped: [] as string[],
    }

    const payload = await getPayload({ config: configPromise })
    const cityIdBySlug = new Map<string, string | number>()
    const parkIdBySlug = new Map<string, string | number>()

    for (const rawCity of citiesInput) {
      const city = prepareCity(rawCity)
      if (!city.slug || !city.title) {
        summary.skipped.push(`Город пропущен: нужен title и slug.`)
        continue
      }

      const existing = await findOne(payload, CITIES_COLLECTION, { slug: { equals: city.slug } })
      if (existing) {
        summary.citiesToUpdate += 1
        cityIdBySlug.set(city.slug, existing.id)
        if (mode === 'import') {
          await payload.update({ collection: CITIES_COLLECTION, id: existing.id, data: city, overrideAccess: true })
        }
      } else {
        summary.citiesToCreate += 1
        if (mode === 'import') {
          const created = await payload.create({ collection: CITIES_COLLECTION, data: city, overrideAccess: true })
          cityIdBySlug.set(city.slug, created.id)
        }
      }
    }

    for (const rawPark of parksInput) {
      const park = preparePark(rawPark)
      if (!park.slug || !park.title) {
        summary.skipped.push(`Парк пропущен: нужен title и slug.`)
        continue
      }

      const citySlug = cleanText(rawPark.citySlug) || slugify(cleanText(rawPark.cityTitle))
      if (!citySlug) {
        summary.skipped.push(`Парк «${park.title}» пропущен: нужен citySlug или cityTitle.`)
        continue
      }

      let cityId = cityIdBySlug.get(citySlug)
      if (!cityId) {
        const existingCity = await findOne(payload, CITIES_COLLECTION, { slug: { equals: citySlug } })
        if (existingCity) {
          cityId = existingCity.id
          cityIdBySlug.set(citySlug, cityId)
        }
      }

      if (!cityId) {
        const cityTitle = cleanText(rawPark.cityTitle) || citySlug
        summary.citiesToCreate += 1
        if (mode === 'import') {
          const createdCity = await payload.create({
            collection: CITIES_COLLECTION,
            data: {
              title: cityTitle,
              slug: citySlug,
              region: cleanText(rawPark.region),
              summary: `Вейк-парки города ${cityTitle}.`,
              sortOrder: 100,
            },
            overrideAccess: true,
          })
          cityId = createdCity.id
          cityIdBySlug.set(citySlug, cityId)
        }
      }

      if (mode === 'dryRun') {
        const existingPark = cityId
          ? await findOne(payload, PARKS_COLLECTION, {
              and: [{ slug: { equals: park.slug } }, { city: { equals: cityId } }],
            })
          : null
        if (existingPark) summary.parksToUpdate += 1
        else summary.parksToCreate += 1
        continue
      }

      if (!cityId) continue

      const data = { ...park, city: cityId }
      const existingPark = await findOne(payload, PARKS_COLLECTION, {
        and: [{ slug: { equals: park.slug } }, { city: { equals: cityId } }],
      })

      if (existingPark) {
        summary.parksToUpdate += 1
        await payload.update({ collection: PARKS_COLLECTION, id: existingPark.id, data, overrideAccess: true })
        parkIdBySlug.set(park.slug, existingPark.id)
      } else {
        summary.parksToCreate += 1
        const createdPark = await payload.create({ collection: PARKS_COLLECTION, data, overrideAccess: true })
        parkIdBySlug.set(park.slug, createdPark.id)
      }
    }

    if (mode === 'import') {
      for (const rawPrice of pricesInput) {
        const price = preparePrice(rawPrice)
        if (!price.title) continue
        const parkSlug = cleanText(rawPrice.parkSlug)
        if (!parkSlug) {
          summary.skipped.push(`Цена «${price.title}» пропущена: нужен parkSlug.`)
          continue
        }

        let parkId = parkIdBySlug.get(parkSlug)
        if (!parkId) {
          const existingPark = await findOne(payload, PARKS_COLLECTION, { slug: { equals: parkSlug } })
          if (existingPark) parkId = existingPark.id
        }

        if (!parkId) {
          summary.skipped.push(`Цена «${price.title}» пропущена: парк ${parkSlug} не найден.`)
          continue
        }

        await payload.create({
          collection: PRICES_COLLECTION,
          data: {
            ...price,
            park: parkId,
          },
          overrideAccess: true,
        })
        summary.pricesToCreate += 1
      }
    } else {
      summary.pricesToCreate = pricesInput.length
    }

    return NextResponse.json({ ok: true, summary })
  } catch (error) {
    console.error('import-catalog error', error)
    return NextResponse.json({ error: 'Не удалось выполнить импорт. Проверь формат JSON.' }, { status: 500 })
  }
}

async function findOne(payload: any, collection: any, where: any) {
  const result = await payload.find({ collection, where, limit: 1, pagination: false, depth: 0 })
  return result.docs?.[0] || null
}

function prepareCity(raw: any) {
  const title = cleanText(raw.title || raw.name || raw.cityTitle)
  const slug = slugify(cleanText(raw.slug || raw.citySlug || title))

  return {
    title,
    slug,
    region: cleanText(raw.region),
    summary: cleanText(raw.summary || raw.shortDescription || (title ? "Вейк-парк " + title + "." : "Вейк-парк."), 3000),
    isPopular: Boolean(raw.isPopular),
    sortOrder: numberOrDefault(raw.sortOrder, 100),
    coordinates: {
      lat: numberOrUndefined(raw.coordinates?.lat ?? raw.lat),
      lng: numberOrUndefined(raw.coordinates?.lng ?? raw.lng),
    },
    meta: {
      title: cleanText(raw.meta?.title || raw.seoTitle),
      description: cleanText(raw.meta?.description || raw.seoDescription, 500),
    },
  }
}

function preparePark(raw: any) {
  const title = cleanText(raw.title || raw.name || raw.parkTitle)
  const slug = slugify(cleanText(raw.slug || raw.parkSlug || title))
  const status = allowedStatuses.has(String(raw.status)) ? String(raw.status) : 'pending'
  const features = normalizeFeatures(raw.features)
  const contacts = raw.contacts || {}
  const location = raw.location || {}

  return {
    title,
    slug,
    status,
    published: status === 'published',
    summary: cleanText(raw.summary || raw.shortDescription || (title ? "Вейк-парк " + title + "." : "Вейк-парк."), 3000),
    description: cleanText(raw.description || raw.fullDescription || raw.summary, 8000),
    priceFrom: numberOrUndefined(raw.priceFrom),
    rating: numberOrUndefined(raw.rating),
    cableTypes: normalizeList(raw.cableTypes),
    features,
    contacts: {
      phone: cleanText(contacts.phone || raw.phone),
      website: normalizeUrl(contacts.website || raw.website),
      vk: normalizeUrl(contacts.vk || raw.vk),
      telegram: normalizeTelegram(contacts.telegram || raw.telegram),
    },
    location: {
      address: cleanText(location.address || raw.address),
      district: cleanText(location.district || raw.district),
      yandexMapsUrl: normalizeUrl(location.yandexMapsUrl || raw.yandexMapsUrl),
      lat: numberOrUndefined(location.lat ?? raw.lat),
      lng: numberOrUndefined(location.lng ?? raw.lng),
    },
    workTime: cleanText(raw.workTime),
    season: cleanText(raw.season),
    isVerified: Boolean(raw.isVerified),
    isFeatured: Boolean(raw.isFeatured),
    isClaimed: Boolean(raw.isClaimed),
    meta: {
      title: cleanText(raw.meta?.title || raw.seoTitle),
      description: cleanText(raw.meta?.description || raw.seoDescription, 500),
    },
  }
}

function preparePrice(raw: any) {
  const category = allowedPriceCategories.has(String(raw.category)) ? String(raw.category) : 'other'

  return {
    title: cleanText(raw.title || raw.name),
    category,
    description: cleanText(raw.description, 1000),
    price: numberOrUndefined(raw.price),
    weekdayPrice: numberOrUndefined(raw.weekdayPrice),
    weekendPrice: numberOrUndefined(raw.weekendPrice),
    duration: cleanText(raw.duration),
    sortOrder: numberOrDefault(raw.sortOrder, 100),
    status: allowedStatuses.has(String(raw.status)) ? String(raw.status) : 'pending',
    sourceNote: cleanText(raw.sourceNote, 1000),
  }
}

function normalizeFeatures(value: unknown) {
  if (!value) return {}
  if (Array.isArray(value)) return Object.fromEntries(value.map((key) => [String(key), true]))
  if (typeof value === 'string') return Object.fromEntries(normalizeList(value).map((key) => [key, true]))
  if (typeof value === 'object') return value as Record<string, boolean>
  return {}
}

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  if (typeof value === 'string') return value.split('|').map((item) => item.trim()).filter(Boolean)
  return []
}

function cleanText(value: unknown, maxLength = 2000): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function numberOrUndefined(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const number = Number(String(value).replace(',', '.'))
  return Number.isFinite(number) && number >= 0 ? number : undefined
}

function numberOrDefault(value: unknown, fallback: number) {
  return numberOrUndefined(value) ?? fallback
}

function normalizeUrl(value: unknown): string {
  const text = cleanText(value)
  if (!text) return ''
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  return `https://${text}`
}

function normalizeTelegram(value: unknown): string {
  const text = cleanText(value)
  if (!text) return ''
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  if (text.startsWith('@')) return `https://t.me/${text.slice(1)}`
  return text
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ё/g, 'e')
    .replace(/й/g, 'i')
    .replace(/[^a-z0-9а-я]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item'
}
