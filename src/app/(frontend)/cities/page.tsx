import { CityCard, EmptyCatalogHint } from '../_wake/cards'
import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { countParksByCity, getCities, getParks, getCityRefId, type CityDoc } from '../_wake/queries'
import { getSiteSettings } from '../_wake/siteSettings'

export const metadata = {
  title: 'Города — Wake Parks Russia',
  description: 'Города России, в которых собраны вейкборд-парки, школы и зоны катания.',
}

export default async function CitiesPage() {
  const [cities, parks, settings] = await Promise.all([getCities(), getParks(500), getSiteSettings()])
  const parkCounts = countParksByCity(parks)
  const sortedCities = sortCities(cities, parkCounts, settings.catalog?.citySort || 'parksCount')
  const visibleCities = settings.catalog?.showEmptyCities === false
    ? sortedCities.filter((city) => (parkCounts.get(getCityRefId(city) || '') || 0) > 0)
    : sortedCities
  const activeCities = sortedCities.filter((city) => (parkCounts.get(getCityRefId(city) || '') || 0) > 0).length

  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ label: 'Города' }]} />
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Города</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Где покататься на вейкборде</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Выбери город, чтобы посмотреть вейк-парки, цены, услуги, контакты и инфраструктуру. Сортировка и показ пустых городов настраиваются в админке.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-secondary px-4 py-2">Городов в CMS: {cities.length}</span>
          <span className="rounded-full bg-secondary px-4 py-2">Показано: {visibleCities.length}</span>
          <span className="rounded-full bg-secondary px-4 py-2">С парками: {activeCities}</span>
          <span className="rounded-full bg-secondary px-4 py-2">Парков: {parks.length}</span>
        </div>
      </div>

      <div className="mt-10">
        {visibleCities.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleCities.map((city) => (
              <CityCard city={city} key={city.id} parksCount={parkCounts.get(getCityRefId(city) || '') || 0} />
            ))}
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </div>
    </main>
  )
}

function sortCities(cities: CityDoc[], parkCounts: Map<string, number>, mode: string): CityDoc[] {
  return [...cities].sort((a, b) => {
    if (mode === 'alphabet') {
      return String(a.title || '').localeCompare(String(b.title || ''), 'ru')
    }

    if (mode === 'manual') {
      const orderDiff = (a.sortOrder || 100) - (b.sortOrder || 100)
      if (orderDiff !== 0) return orderDiff
      return String(a.title || '').localeCompare(String(b.title || ''), 'ru')
    }

    const countDiff = (parkCounts.get(getCityRefId(b) || '') || 0) - (parkCounts.get(getCityRefId(a) || '') || 0)
    if (countDiff !== 0) return countDiff
    return String(a.title || '').localeCompare(String(b.title || ''), 'ru')
  })
}
