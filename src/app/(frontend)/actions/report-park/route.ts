import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

type ReportParkBody = {
  parkId?: string | number
  type?: string
  message?: string
  sourceUrl?: string
  authorName?: string
  contactEmail?: string
  company?: string
}

const allowedTypes = new Set(['price', 'contacts', 'location', 'schedule', 'features', 'closed', 'duplicate', 'other'])

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReportParkBody

    if (body.company) {
      return NextResponse.json({ ok: true })
    }

    const parkId = normalizeId(body.parkId)
    const type = allowedTypes.has(String(body.type)) ? String(body.type) : 'other'
    const message = cleanText(body.message, 3000)

    if (!parkId) {
      return NextResponse.json({ error: 'Не удалось определить парк для правки.' }, { status: 400 })
    }

    if (!message || message.length < 15) {
      return NextResponse.json({ error: 'Опиши правку минимум на 15 символов.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'park-reports' as any,
      data: {
        park: parkId,
        status: 'new',
        type,
        message,
        sourceUrl: normalizeUrlOrText(body.sourceUrl),
        authorName: cleanText(body.authorName, 100),
        contactEmail: cleanText(body.contactEmail, 200),
      },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('report-park error', error)
    return NextResponse.json({ error: 'Не удалось отправить правку. Проверь данные и попробуй ещё раз.' }, { status: 500 })
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

function normalizeUrlOrText(value: unknown): string {
  const text = cleanText(value, 500)
  if (!text) return ''
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  if (text.includes('.') && !text.includes(' ')) return `https://${text}`
  return text
}
