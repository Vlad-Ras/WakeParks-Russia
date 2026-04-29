import { EmptyCatalogHint } from '../_wake/cards'
import { getCityFromPark, getCities, getParks } from '../_wake/queries'
import { MapExplorer } from './MapExplorer'

export const metadata = {
  title: 'Карта вейк-парков России — Wake Parks Russia',
  description: 'Интерактивная карта вейк-парков с фильтром по городам, адресами, координатами и ссылками на маршрут.',
}

export default async function MapPage() {
  const [cities, parks] = await Promise.all([getCities(), getParks(500)])
  const parksWithLocation = parks.filter((park) => {
    const city = getCityFromPark(park)
    return city?.slug && park.slug && (park.location?.address || park.location?.yandexMapsUrl || (park.location?.lat && park.location?.lng))
  })

  const mapCities = cities
    .filter((city) => city.slug)
    .map((city) => ({
      id: String(city.id),
      title: city.title || 'Без названия',
      slug: city.slug || '',
    }))

  const mapParks = parksWithLocation.map((park) => {
    const city = getCityFromPark(park)
    return {
      id: String(park.id),
      title: park.title || 'Без названия',
      slug: park.slug || '',
      cityTitle: city?.title || 'Город не указан',
      citySlug: city?.slug || '',
      summary: park.summary || '',
      priceFrom: park.priceFrom,
      rating: park.rating,
      address: park.location?.address || '',
      district: park.location?.district || '',
      lat: park.location?.lat,
      lng: park.location?.lng,
      yandexMapsUrl: park.location?.yandexMapsUrl || '',
      cableTypes: park.cableTypes || [],
      features: Object.entries(park.features || {})
        .filter(([, enabled]) => enabled)
        .map(([feature]) => feature),
    }
  })

  return (
    <main className="container py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Карта</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Карта вейк-парков России</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            Выбирай город, услуги и тип катания, кликай по маркерам и открывай карточку парка с ценами, контактами и маршрутом.
            Карта работает без API-ключа: маркеры строятся по координатам, а выбранный парк дополнительно открывается во встроенной Яндекс.Карте.
          </p>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Как сделать карту точнее</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            В админке у парка заполняй широту и долготу. Если координат нет, карточка всё равно появится в списке,
            но вместо карты будет подсказка.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
            <span className="rounded-full bg-secondary px-3 py-2">Городов: {mapCities.length}</span>
            <span className="rounded-full bg-secondary px-3 py-2">Парков в списке: {mapParks.length}</span>
          </div>
        </aside>
      </div>

      {mapParks.length ? <MapExplorer cities={mapCities} parks={mapParks} /> : <div className="mt-10"><EmptyCatalogHint /></div>}
    </main>
  )
}
