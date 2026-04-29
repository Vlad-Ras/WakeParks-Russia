import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { getSiteSettings } from '../../_wake/siteSettings'

type ClaimParkBody = {
  parkId?: string | number
  claimType?: string
  requestedActions?: unknown
  contactName?: string
  companyName?: string
  role?: string
  phone?: string
  telegram?: string
  email?: string
  preferredContact?: string
  proofUrl?: string
  proofUrl2?: string
  message?: string
  consent?: string
  company?: string
}

const allowedClaimTypes = new Set(['owner', 'manager', 'representative', 'updateAccess', 'partnership', 'other'])
const allowedPreferredContacts = new Set(['telegram', 'phone', 'email'])
const allowedRequestedActions = new Set(['claimCard', 'updateContacts', 'updatePrices', 'updatePhotos', 'updateSchedule', 'addPromotion'])

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClaimParkBody

    const settings = await getSiteSettings()

    if (settings.forms?.claimFormEnabled === false) {
      return NextResponse.json({ error: 'Форма подтверждения владельца временно отключена.' }, { status: 503 })
    }

    if (settings.forms?.honeypotEnabled !== false && body.company) return NextResponse.json({ ok: true })
    const parkId = normalizeId(body.parkId)
    const claimType = allowedClaimTypes.has(String(body.claimType)) ? String(body.claimType) : 'owner'
    const preferredContact = allowedPreferredContacts.has(String(body.preferredContact)) ? String(body.preferredContact) : 'telegram'
    const requestedActions = normalizeRequestedActions(body.requestedActions)
    const contactName = cleanText(body.contactName, 120)
    const phone = cleanText(body.phone, 80)
    const telegram = normalizeTelegram(body.telegram)
    const email = cleanText(body.email, 200)
    const proofUrl = normalizeUrlOrText(body.proofUrl)
    const proofUrl2 = normalizeUrlOrText(body.proofUrl2)

    if (!parkId) return NextResponse.json({ error: 'Выбери парк, к которому относится заявка.' }, { status: 400 })
    if (!contactName || contactName.length < 2) return NextResponse.json({ error: 'Укажи контактное лицо.' }, { status: 400 })
    if (!phone && !telegram && !email) return NextResponse.json({ error: 'Оставь хотя бы один контакт: телефон, Telegram или email.' }, { status: 400 })
    if (!proofUrl) return NextResponse.json({ error: 'Добавь подтверждающую ссылку: сайт парка, VK, Яндекс.Карты, 2ГИС или другой источник.' }, { status: 400 })
    if (body.consent !== 'yes') return NextResponse.json({ error: 'Нужно согласие на обработку персональных данных.' }, { status: 400 })

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'park-claims' as any,
      data: {
        park: parkId,
        status: 'new',
        claimType,
        requestedActions,
        contactName,
        companyName: cleanText(body.companyName, 200),
        role: cleanText(body.role, 160),
        phone,
        telegram,
        email,
        preferredContact,
        proofUrl,
        proofUrl2,
        message: cleanText(body.message, 3000),
        privacyConsent: true,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('claim-park error', error)
    return NextResponse.json({ error: 'Не удалось отправить заявку владельца. Проверь данные и попробуй ещё раз.' }, { status: 500 })
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

function normalizeRequestedActions(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
  const result = values.map((item) => String(item)).filter((item) => allowedRequestedActions.has(item))
  return result.length ? result : ['claimCard']
}

function normalizeUrlOrText(value: unknown): string {
  const text = cleanText(value, 500)
  if (!text) return ''
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  if (text.includes('.') && !text.includes(' ')) return `https://${text}`
  return text
}

function normalizeTelegram(value: unknown): string {
  const text = cleanText(value, 120)
  if (!text) return ''
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  if (text.startsWith('@')) return `https://t.me/${text.slice(1)}`
  return text
}
