import type { CityDoc, ParkDoc } from './queries'
import { getCityFromPark } from './queries'

export type RegionGroup = {
  title: string
  slug: string
  cities: CityDoc[]
  parks: ParkDoc[]
}

const translitMap: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

export function normalizeRegionName(value?: string | null) {
  const trimmed = String(value || '').trim()
  return trimmed || 'Регион не указан'
}

export function slugifyRegion(value?: string | null) {
  const normalized = normalizeRegionName(value).toLowerCase()
  const transliterated = normalized
    .split('')
    .map((char) => translitMap[char] ?? char)
    .join('')

  return transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown-region'
}

export function buildRegionGroups(cities: CityDoc[], parks: ParkDoc[]): RegionGroup[] {
  const groups = new Map<string, RegionGroup>()

  for (const city of cities) {
    const title = normalizeRegionName(city.region)
    const slug = slugifyRegion(title)
    const existing = groups.get(slug)

    if (existing) {
      existing.cities.push(city)
    } else {
      groups.set(slug, {
        title,
        slug,
        cities: [city],
        parks: [],
      })
    }
  }

  for (const park of parks) {
    const city = getCityFromPark(park)
    const slug = slugifyRegion(city?.region)
    const title = normalizeRegionName(city?.region)
    const existing = groups.get(slug)

    if (existing) {
      existing.parks.push(park)
    } else {
      groups.set(slug, {
        title,
        slug,
        cities: [],
        parks: [park],
      })
    }
  }

  return Array.from(groups.values()).sort((a, b) => {
    if (b.parks.length !== a.parks.length) return b.parks.length - a.parks.length
    if (b.cities.length !== a.cities.length) return b.cities.length - a.cities.length
    return a.title.localeCompare(b.title, 'ru')
  })
}

export function findRegionGroup(groups: RegionGroup[], regionSlug: string) {
  return groups.find((group) => group.slug === regionSlug) || null
}
