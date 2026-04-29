import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

type AddParkPrice = {
  title?: string
  category?: string
  description?: string
  price?: string | number
  weekdayPrice?: string | number
  weekendPrice?: string | number
  duration?: string
}

type AddParkBody = {
  title?: string
  cityId?: string | number
  summary?: string
  description?: string
  address?: string
  district?: string
  yandexMapsUrl?: string
  workTime?: string
  season?: string
  phone?: string
  website?: string
  vk?: string
  telegram?: string
  priceFrom?: string | number
  submitterName?: string
  submitterPhone?: string
  submitterEmail?: string
  comment?: string
  company?: string
  features?: Record<string, boolean>
  cableTypes?: string[]
  prices?: AddParkPrice[]
  photoUrls?: string[]
}

const allowedPriceCategories = new Set(['wake', 'training', 'rent', 'sup', 'package', 'other'])

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AddParkBody

    if (body.company) {
      return NextResponse.json({ ok: true })
    }

    const title = cleanText(body.title)
    const rawCityId = body.cityId
    const cityId = typeof rawCityId === 'string' && /^\d+$/.test(rawCityId) ? Number(rawCityId) : rawCityId
    const summary = cleanText(body.summary)
    const description = cleanText(body.description, 5000)
    const preparedPrices = preparePrices(body.prices)
    const submittedPhotoUrls = Array.isArray(body.photoUrls)
      ? body.photoUrls.map((url) => normalizeUrl(url)).filter(Boolean).slice(0, 10)
      : []

    if (!title || title.length < 2) {
      return NextResponse.json({ error: 'Укажи название парка.' }, { status: 400 })
    }

    if (!cityId) {
      return NextResponse.json({ error: 'Выбери город.' }, { status: 400 })
    }

    if (!summary || summary.length < 20) {
      return NextResponse.json({ error: 'Добавь краткое описание минимум на 20 символов.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const slug = `${slugify(title)}-${Date.now().toString(36)}`
    const autoPriceFrom = getMinSubmittedPrice(preparedPrices)
    const priceFrom = numberOrUndefined(body.priceFrom) ?? autoPriceFrom
    const moderatorComment = [
      cleanText(body.comment, 3000),
      submittedPhotoUrls.length ? `Фото от отправителя:\n${submittedPhotoUrls.join('\n')}` : '',
    ]
      .filter(Boolean)
      .join('\n\n')

    const createdPark = await payload.create({
      collection: 'parks' as any,
      data: {
        title,
        slug,
        city: cityId,
        summary,
        description: description || summary,
        priceFrom,
        cableTypes: Array.isArray(body.cableTypes) ? body.cableTypes : [],
        features: body.features || {},
        contacts: {
          phone: cleanText(body.phone),
          website: normalizeUrl(body.website),
          vk: normalizeUrl(body.vk),
          telegram: normalizeTelegram(body.telegram),
        },
        location: {
          address: cleanText(body.address),
          district: cleanText(body.district),
          yandexMapsUrl: normalizeUrl(body.yandexMapsUrl),
        },
        workTime: cleanText(body.workTime),
        season: cleanText(body.season),
        submission: {
          submitterName: cleanText(body.submitterName),
          submitterPhone: cleanText(body.submitterPhone),
          submitterEmail: cleanText(body.submitterEmail),
          comment: moderatorComment,
        },
        status: 'pending',
        published: false,
        isVerified: false,
        isFeatured: false,
      },
      overrideAccess: true,
    })

    for (const [index, price] of preparedPrices.entries()) {
      await payload.create({
        collection: 'prices' as any,
        data: {
          park: createdPark.id,
          title: price.title,
          category: price.category,
          description: price.description,
          price: price.price,
          weekdayPrice: price.weekdayPrice,
          weekendPrice: price.weekendPrice,
          duration: price.duration,
          sortOrder: index + 1,
          status: 'pending',
          sourceNote: 'Добавлено через публичную форму вместе с парком. Проверь цену перед публикацией.',
        },
        overrideAccess: true,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('add-park error', error)
    return NextResponse.json({ error: 'Не удалось отправить парк. Проверь данные и попробуй ещё раз.' }, { status: 500 })
  }
}

function preparePrices(prices: unknown): Array<{
  title: string
  category: string
  description: string
  price?: number
  weekdayPrice?: number
  weekendPrice?: number
  duration: string
}> {
  if (!Array.isArray(prices)) return []

  return prices
    .map((raw) => {
      const price = raw as AddParkPrice
      const title = cleanText(price.title)
      const category = allowedPriceCategories.has(String(price.category)) ? String(price.category) : 'other'
      const prepared = {
        title,
        category,
        description: cleanText(price.description, 1000),
        price: numberOrUndefined(price.price),
        weekdayPrice: numberOrUndefined(price.weekdayPrice),
        weekendPrice: numberOrUndefined(price.weekendPrice),
        duration: cleanText(price.duration),
      }

      return prepared
    })
    .filter((price) => price.title || price.price || price.weekdayPrice || price.weekendPrice)
    .map((price) => ({
      ...price,
      title: price.title || 'Услуга',
    }))
    .slice(0, 20)
}

function getMinSubmittedPrice(prices: ReturnType<typeof preparePrices>): number | undefined {
  const values = prices
    .flatMap((price) => [price.price, price.weekdayPrice, price.weekendPrice])
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0)

  if (!values.length) return undefined
  return Math.min(...values)
}

function cleanText(value: unknown, maxLength = 2000): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function numberOrUndefined(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : undefined
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
    .slice(0, 50) || 'wake-park'
}
