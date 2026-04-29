import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type SiteSettingsDoc = {
  projectName?: string
  tagline?: string
  contacts?: {
    publicEmail?: string
    phone?: string
    telegram?: string
    vk?: string
  }
  catalog?: {
    showEmptyCities?: boolean
    citySort?: 'parksCount' | 'alphabet' | 'manual'
    parkSort?: 'featured' | 'ratingDesc' | 'priceAsc' | 'priceDesc' | 'titleAsc'
    showDataQuality?: boolean
  }
  forms?: {
    contactFormEnabled?: boolean
    addParkFormEnabled?: boolean
    reviewFormEnabled?: boolean
    reportFormEnabled?: boolean
    claimFormEnabled?: boolean
    honeypotEnabled?: boolean
    newParkStatus?: 'draft' | 'pending'
    newPriceStatus?: 'draft' | 'pending'
    newReviewStatus?: 'pending' | 'published'
  }
  seoDefaults?: {
    title?: string
    description?: string
  }
}

const fallbackSettings: SiteSettingsDoc = {
  projectName: 'Wake Parks Russia',
  tagline: 'Каталог вейкборд-парков России: города, цены, обучение, инфраструктура, отзывы и маршруты.',
  catalog: {
    showEmptyCities: true,
    citySort: 'parksCount',
    parkSort: 'featured',
    showDataQuality: true,
  },
  forms: {
    contactFormEnabled: true,
    addParkFormEnabled: true,
    reviewFormEnabled: true,
    reportFormEnabled: true,
    claimFormEnabled: true,
    honeypotEnabled: true,
    newParkStatus: 'pending',
    newPriceStatus: 'pending',
    newReviewStatus: 'pending',
  },
  seoDefaults: {
    title: 'Wake Parks Russia — вейк-парки России',
    description: 'Каталог вейкборд-парков России по городам: цены, обучение, инфраструктура, контакты, отзывы и маршруты.',
  },
}

export async function getSiteSettings(): Promise<SiteSettingsDoc> {
  const payload = await getPayload({ config: configPromise })

  try {
    const settings = (await payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 0,
    })) as SiteSettingsDoc | null

    return mergeSettings(settings)
  } catch {
    return fallbackSettings
  }
}

function mergeSettings(settings?: SiteSettingsDoc | null): SiteSettingsDoc {
  return {
    ...fallbackSettings,
    ...(settings || {}),
    contacts: {
      ...(fallbackSettings.contacts || {}),
      ...(settings?.contacts || {}),
    },
    catalog: {
      ...(fallbackSettings.catalog || {}),
      ...(settings?.catalog || {}),
    },
    forms: {
      ...(fallbackSettings.forms || {}),
      ...(settings?.forms || {}),
    },
    seoDefaults: {
      ...(fallbackSettings.seoDefaults || {}),
      ...(settings?.seoDefaults || {}),
    },
  }
}

export function normalizeTelegramUrl(value?: string): string {
  const text = (value || '').trim()
  if (!text) return ''
  if (text.startsWith('http://') || text.startsWith('https://')) return text
  if (text.startsWith('@')) return `https://t.me/${text.slice(1)}`
  return text
}
