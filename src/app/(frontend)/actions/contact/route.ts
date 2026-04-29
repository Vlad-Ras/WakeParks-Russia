import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { getSiteSettings } from '../../_wake/siteSettings'

type ContactBody = {
  requestType?: string
  name?: string
  subject?: string
  email?: string
  phone?: string
  telegram?: string
  message?: string
  sourcePage?: string
  company?: string
  privacyAccepted?: boolean
}

const allowedTypes = new Set(['general', 'partnership', 'park', 'ads', 'bug', 'legal'])

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody

    const settings = await getSiteSettings()

    if (settings.forms?.contactFormEnabled === false) {
      return NextResponse.json({ error: 'Форма контактов временно отключена.' }, { status: 503 })
    }

    // honeypot: if bot fills hidden company field, answer ok and do nothing
    if (settings.forms?.honeypotEnabled !== false && body.company) {
      return NextResponse.json({ ok: true })
    }

    const name = cleanText(body.name, 120)
    const subject = cleanText(body.subject, 180)
    const message = cleanText(body.message, 5000)
    const email = cleanText(body.email, 240)
    const phone = cleanText(body.phone, 80)
    const telegram = cleanText(body.telegram, 120)
    const requestType = allowedTypes.has(String(body.requestType)) ? String(body.requestType) : 'general'

    if (!body.privacyAccepted) {
      return NextResponse.json({ error: 'Нужно согласиться с обработкой персональных данных.' }, { status: 400 })
    }

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Укажи имя.' }, { status: 400 })
    }

    if (!subject || subject.length < 3) {
      return NextResponse.json({ error: 'Укажи тему обращения.' }, { status: 400 })
    }

    if (!message || message.length < 15) {
      return NextResponse.json({ error: 'Сообщение должно быть минимум 15 символов.' }, { status: 400 })
    }

    if (!email && !phone && !telegram) {
      return NextResponse.json({ error: 'Оставь хотя бы один контакт: email, телефон или Telegram.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'contact-requests' as any,
      data: {
        status: 'new',
        requestType,
        name,
        subject,
        email,
        phone,
        telegram: normalizeTelegram(telegram),
        message,
        sourcePage: cleanText(body.sourcePage, 500),
      },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('contact request error', error)
    return NextResponse.json({ error: 'Не удалось отправить обращение. Проверь данные и попробуй ещё раз.' }, { status: 500 })
  }
}

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function normalizeTelegram(value: string): string {
  const text = value.trim()
  if (!text) return ''
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  if (text.startsWith('@')) return `https://t.me/${text.slice(1)}`
  return text
}
