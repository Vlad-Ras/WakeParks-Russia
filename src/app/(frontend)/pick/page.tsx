import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { getImageAlt, getImageUrl } from '../_wake/media'
import { getCityFromPark, getCities, getParks } from '../_wake/queries'
import { ParkPickerClient, type PickerCity, type PickerPark } from './ParkPickerClient'

export const metadata = {
  title: 'Подбор вейк-парка — Wake Parks Russia',
  description:
    'Подберите вейкборд-парк по городу, цене, обучению, детской школе, SUP, инфраструктуре и типу катания.',
}

export default async function PickParkPage() {
  const [cities, parks] = await Promise.all([getCities(), getParks(300)])

  const cityOptions: PickerCity[] = cities.map((city) => ({
    id: String(city.id),
    title: city.title || 'Город',
    slug: city.slug,
  }))

  const pickerParks: PickerPark[] = parks.map((park) => {
    const city = getCityFromPark(park)
    const primaryImage = park.cardImage || park.gallery?.[0]
    const href = city?.slug && park.slug ? `/wake-parks/${city.slug}/${park.slug}` : '/wake-parks'

    return {
      id: String(park.id),
      title: park.title || 'Вейк-парк',
      cityId: city?.id ? String(city.id) : undefined,
      cityTitle: city?.title,
      citySlug: city?.slug,
      parkSlug: park.slug,
      href,
      summary: park.summary,
      address: park.location?.address,
      imageUrl: getImageUrl(primaryImage, 'medium'),
      imageAlt: getImageAlt(primaryImage, park.title || 'Вейк-парк'),
      priceFrom: park.priceFrom || null,
      rating: park.rating || null,
      features: Object.entries(park.features || {})
        .filter(([, enabled]) => enabled)
        .map(([key]) => key),
      cableTypes: park.cableTypes || [],
      isVerified: park.isVerified,
      isClaimed: park.isClaimed,
      isFeatured: park.isFeatured,
    }
  })

  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ label: 'Подбор парка' }]} />

      <section className="mb-10 rounded-3xl border border-border bg-gradient-to-br from-cyan-50 via-background to-emerald-50 p-8 dark:from-slate-950 dark:via-background dark:to-cyan-950 md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Подбор</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
          Подберём вейк-парк под твою поездку
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
          Выбери город, бюджет, цель и обязательные услуги. Сайт посчитает совпадение и покажет самые подходящие
          варианты из опубликованного каталога.
        </p>
      </section>

      <ParkPickerClient cities={cityOptions} parks={pickerParks} />
    </main>
  )
}
