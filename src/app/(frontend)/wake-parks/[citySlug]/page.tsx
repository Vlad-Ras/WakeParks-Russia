import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '../../_wake/Breadcrumbs'
import { CityFilters, type CityFilterValues } from '../../_wake/CityFilters'
import { EmptyCatalogHint, ParkCard } from '../../_wake/cards'
import { getImageAlt, getImageUrl, getObjectPosition } from '../../_wake/media'
import { getSiteSettings } from '../../_wake/siteSettings'
import type { ParkDoc } from '../../_wake/queries'
import { getCities, getCityBySlug, getParksByCity } from '../../_wake/queries'

export async function generateStaticParams() {
  const cities = await getCities()
  return cities.filter((city) => city.slug).map((city) => ({ citySlug: city.slug }))
}

type Args = {
  params: Promise<{
    citySlug: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { citySlug } = await paramsPromise
  const city = await getCityBySlug(decodeURIComponent(citySlug))

  if (!city) {
    return {
      title: 'Город не найден — Wake Parks Russia',
    }
  }

  return {
    title: city.meta?.title || `Вейк-парки ${city.title} — Wake Parks Russia`,
    description:
      city.meta?.description ||
      `Каталог вейкборд-парков города ${city.title}: цены, обучение, канатки, инфраструктура и контакты.`,
  }
}

export default async function CityWakeParksPage({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { citySlug } = await paramsPromise
  const rawSearchParams = (await searchParamsPromise) || {}
  const city = await getCityBySlug(decodeURIComponent(citySlug))

  if (!city) notFound()

  const settings = await getSiteSettings()
  const filters = normalizeFilters(rawSearchParams, settings.catalog?.parkSort || 'featured')
  const cityImageUrl = getImageUrl(city.coverImage, 'large')
  const cityImagePosition = getObjectPosition(city.imageSettings?.objectPosition)
  const allParks = await getParksByCity(city.id)
  const parks = filterAndSortParks(allParks, filters)

  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ href: '/wake-parks', label: 'Парки' }, { label: 'Вейк-парки ' + city.title }]} />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {city.region || 'Россия'}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Вейк-парки {city.title}</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            {city.summary ||
              `Список вейк-парков города ${city.title}. Сравни цены, обучение, инфраструктуру и контакты.`}
          </p>
          {cityImageUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
              <img
                alt={getImageAlt(city.coverImage, `Вейк-парки ${city.title}`)}
                className={`h-[220px] w-full object-cover md:h-[360px] ${cityImagePosition}`}
                src={cityImageUrl}
              />
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-secondary px-4 py-2">Всего парков: {allParks.length}</span>
            <span className="rounded-full bg-secondary px-4 py-2">Найдено: {parks.length}</span>
          </div>
        </section>

        <CityFilters citySlug={city.slug || citySlug} values={filters} />
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
              Попробуй сбросить часть параметров: цену, услуги или тип катания.
            </p>
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </div>
    </main>
  )
}

function normalizeFilters(params: Record<string, string | string[] | undefined>, defaultSort = 'featured'): CityFilterValues {
  return {
    q: asString(params.q).trim(),
    features: asArray(params.feature),
    cableTypes: asArray(params.cable),
    maxPrice: asString(params.maxPrice).trim(),
    sort: asString(params.sort).trim() || defaultSort,
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

function filterAndSortParks(parks: ParkDoc[], filters: CityFilterValues): ParkDoc[] {
  const q = filters.q?.toLowerCase() || ''
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined

  const filtered = parks.filter((park) => {
    if (q) {
      const haystack = [park.title, park.summary, park.description, park.location?.address, park.location?.district]
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
