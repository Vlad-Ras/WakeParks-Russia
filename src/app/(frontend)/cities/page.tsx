import { CityCard, EmptyCatalogHint } from '../_wake/cards'
import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { getCities, getParks } from '../_wake/queries'

export const metadata = {
  title: 'Города — Wake Parks Russia',
  description: 'Города России, в которых собраны вейкборд-парки, школы и зоны катания.',
}

export default async function CitiesPage() {
  const [cities, parks] = await Promise.all([getCities(), getParks(500)])
  const parkCounts = new Map<string | number, number>()

  parks.forEach((park) => {
    const city = typeof park.city === 'object' && park.city ? park.city : null
    if (!city?.id) return
    parkCounts.set(city.id, (parkCounts.get(city.id) || 0) + 1)
  })

  const sortedCities = [...cities].sort((a, b) => {
    const countDiff = (parkCounts.get(b.id) || 0) - (parkCounts.get(a.id) || 0)
    if (countDiff !== 0) return countDiff
    return String(a.title || '').localeCompare(String(b.title || ''), 'ru')
  })
  const activeCities = sortedCities.filter((city) => (parkCounts.get(city.id) || 0) > 0).length

  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ label: 'Города' }]} />
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Города</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Где покататься на вейкборде</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Выбери город, чтобы посмотреть вейк-парки, цены, услуги, контакты и инфраструктуру. Города с заполненными парками поднимаются выше.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-secondary px-4 py-2">Городов в CMS: {cities.length}</span>
          <span className="rounded-full bg-secondary px-4 py-2">С парками: {activeCities}</span>
          <span className="rounded-full bg-secondary px-4 py-2">Парков: {parks.length}</span>
        </div>
      </div>

      <div className="mt-10">
        {sortedCities.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sortedCities.map((city) => (
              <CityCard city={city} key={city.id} parksCount={parkCounts.get(city.id) || 0} />
            ))}
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </div>
    </main>
  )
}
