import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { getSiteSettings } from '../../_wake/siteSettings'

type AddReviewBody = {
  parkId?: string | number
  authorName?: string
  rating?: string | number
  text?: string
  contactEmail?: string
  company?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AddReviewBody

    const settings = await getSiteSettings()

    if (settings.forms?.reviewFormEnabled === false) {
      return NextResponse.json({ error: 'Форма отзывов временно отключена.' }, { status: 503 })
    }

    if (settings.forms?.honeypotEnabled !== false && body.company) {
      return NextResponse.json({ ok: true })
    }

    const parkId = normalizeId(body.parkId)
    const authorName = cleanText(body.authorName, 100)
    const text = cleanText(body.text, 2000)
    const rating = Number(body.rating)
    const contactEmail = cleanText(body.contactEmail, 200)

    if (!parkId) {
      return NextResponse.json({ error: 'Не удалось определить парк для отзыва.' }, { status: 400 })
    }

    if (!authorName || authorName.length < 2) {
      return NextResponse.json({ error: 'Укажи имя автора отзыва.' }, { status: 400 })
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Поставь оценку от 1 до 5.' }, { status: 400 })
    }

    if (!text || text.length < 20) {
      return NextResponse.json({ error: 'Отзыв должен быть не короче 20 символов.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'reviews' as any,
      data: {
        park: parkId,
        authorName,
        rating,
        text,
        contactEmail,
        source: 'site',
        status: settings.forms?.newReviewStatus || 'pending',
        isFeatured: false,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('add-review error', error)
    return NextResponse.json({ error: 'Не удалось отправить отзыв. Проверь данные и попробуй ещё раз.' }, { status: 500 })
  }
}

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function normalizeId(value: unknown): string | number | undefined {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed
}
