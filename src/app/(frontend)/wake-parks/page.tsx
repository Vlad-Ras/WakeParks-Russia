import { EmptyCatalogHint, ParkCard } from '../_wake/cards'
import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { ParkDirectoryFilters, type ParkDirectoryFilterValues } from '../_wake/ParkDirectoryFilters'
import type { ParkDoc } from '../_wake/queries'
import { getCityFromPark, getCities, getParks } from '../_wake/queries'

export const metadata = {
  title: 'Все вейк-парки России — Wake Parks Russia',
  description: 'Каталог вейкборд-парков России: города, цены, обучение, канатки, SUP и контакты.',
}

type Args = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function WakeParksPage({ searchParams: searchParamsPromise }: Args) {
  const rawSearchParams = (await searchParamsPromise) || {}
  const filters = normalizeFilters(rawSearchParams)
  const [cities, allParks] = await Promise.all([getCities(), getParks(500)])
  const parks = filterAndSortParks(allParks, filters)

  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ label: 'Парки' }]} />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Каталог</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Вейк-парки России</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            Общий каталог парков по всем городам. Используй фильтры, чтобы найти обучение для новичков,
            SUP, кафе, парковку, нужный тип канатки или подходящую цену.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-secondary px-4 py-2">Всего парков: {allParks.length}</span>
            <span className="rounded-full bg-secondary px-4 py-2">Найдено: {parks.length}</span>
            <span className="rounded-full bg-secondary px-4 py-2">Городов: {cities.length}</span>
          </div>
        </section>

        <ParkDirectoryFilters cities={cities} values={filters} />
      </div>

      <div className="mt-10">
        {parks.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {parks.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        ) : allParks.length ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <h2 className="text-2xl font-semibold">По этим фильтрам ничего не найдено</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Попробуй сбросить часть параметров: город, цену, услуги или тип катания.
            </p>
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </div>
    </main>
  )
}

function normalizeFilters(params: Record<string, string | string[] | undefined>): ParkDirectoryFilterValues {
  return {
    q: asString(params.q).trim(),
    city: asString(params.city).trim(),
    features: asArray(params.feature),
    cableTypes: asArray(params.cable),
    maxPrice: asString(params.maxPrice).trim(),
    sort: asString(params.sort).trim() || 'featured',
  }
}

function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || ''
  return value || ''
}

function asArray(value: string | string[] | undefined): string[] {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value]
}

function filterAndSortParks(parks: ParkDoc[], filters: ParkDirectoryFilterValues): ParkDoc[] {
  const q = filters.q?.toLowerCase() || ''
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined

  const filtered = parks.filter((park) => {
    const city = getCityFromPark(park)

    if (filters.city && city?.slug !== filters.city) return false

    if (q) {
      const haystack = [park.title, city?.title, park.summary, park.description, park.location?.address, park.location?.district]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!haystack.includes(q)) return false
    }

    if (Number.isFinite(maxPrice) && park.priceFrom && maxPrice !== undefined && park.priceFrom > maxPrice) return false

    if (filters.features.length) {
      const hasAllFeatures = filters.features.every((feature) => Boolean(park.features?.[feature]))
      if (!hasAllFeatures) return false
    }

    if (filters.cableTypes.length) {
      const parkCableTypes = park.cableTypes || []
      const hasCableType = filters.cableTypes.some((type) => parkCableTypes.includes(type))
      if (!hasCableType) return false
    }

    return true
  })

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case 'ratingDesc':
        return (b.rating || 0) - (a.rating || 0)
      case 'priceAsc':
        return (a.priceFrom || Number.MAX_SAFE_INTEGER) - (b.priceFrom || Number.MAX_SAFE_INTEGER)
      case 'priceDesc':
        return (b.priceFrom || 0) - (a.priceFrom || 0)
      case 'titleAsc':
        return String(a.title || '').localeCompare(String(b.title || ''), 'ru')
      case 'featured':
      default:
        return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))
    }
  })
}
