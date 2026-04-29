import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '../../_wake/Breadcrumbs'
import { CityCard, EmptyCatalogHint, ParkCard } from '../../_wake/cards'
import { buildRegionGroups, findRegionGroup } from '../../_wake/regionUtils'
import { getCities, getParks } from '../../_wake/queries'

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ regionSlug: string }> }): Promise<Metadata> {
  const { regionSlug } = await paramsPromise
  const [cities, parks] = await Promise.all([getCities(), getParks(1000)])
  const region = findRegionGroup(buildRegionGroups(cities, parks), regionSlug)

  if (!region) {
    return {
      title: 'Регион не найден — Wake Parks Russia',
    }
  }

  return {
    title: `Вейк-парки: ${region.title} — города, цены и обучение`,
    description: `Вейкборд-парки региона ${region.title}: города, площадки, цены, обучение, SUP, канатки, контакты и маршруты.`,
  }
}

export default async function RegionPage({ params: paramsPromise }: { params: Promise<{ regionSlug: string }> }) {
  const { regionSlug } = await paramsPromise
  const [cities, parks] = await Promise.all([getCities(), getParks(1000)])
  const region = findRegionGroup(buildRegionGroups(cities, parks), regionSlug)

  if (!region) notFound()

  const parkCounts = new Map<string | number, number>()
  region.parks.forEach((park) => {
    const city = typeof park.city === 'object' && park.city ? park.city : null
    if (!city?.id) return
    parkCounts.set(city.id, (parkCounts.get(city.id) || 0) + 1)
  })

  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ label: 'Регионы', href: '/regions' }, { label: region.title }]} />
      <section className="max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Регион</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Вейк-парки: {region.title}</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Города и площадки региона в одном разделе. Можно открыть город, сравнить парки, посмотреть цены,
          услуги, маршруты и актуальность данных.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-secondary px-4 py-2">Городов: {region.cities.length}</span>
          <span className="rounded-full bg-secondary px-4 py-2">Парков: {region.parks.length}</span>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Города</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Города региона</h2>
          </div>
        </div>
        {region.cities.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {region.cities.map((city) => (
              <CityCard city={city} key={city.id} parksCount={parkCounts.get(city.id) || 0} />
            ))}
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </section>

      <section className="mt-14">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Парки</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Площадки региона</h2>
          </div>
        </div>
        {region.parks.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {region.parks.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </section>
    </main>
  )
}
