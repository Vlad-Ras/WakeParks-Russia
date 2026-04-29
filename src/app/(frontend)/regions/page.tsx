import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { CityCard, EmptyCatalogHint } from '../_wake/cards'
import { buildRegionGroups } from '../_wake/regionUtils'
import { getCities, getParks } from '../_wake/queries'

export const metadata = {
  title: 'Регионы России с вейк-парками — Wake Parks Russia',
  description: 'Каталог регионов России, где собраны города и вейкборд-парки: цены, обучение, SUP, канатки и контакты.',
}

export default async function RegionsPage() {
  const [cities, parks] = await Promise.all([getCities(), getParks(1000)])
  const regions = buildRegionGroups(cities, parks)

  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ label: 'Регионы' }]} />
      <div className="max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">География</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Вейк-парки по регионам России</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Раздел помогает смотреть каталог не только по городам, но и по регионам: области, края и республики.
          Это удобно для поездок на выходные и расширения SEO-структуры проекта.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-3xl font-semibold">{regions.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">регионов</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-3xl font-semibold">{cities.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">городов</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-3xl font-semibold">{parks.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">парков</p>
        </div>
      </div>

      <section className="mt-12">
        {regions.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {regions.map((region) => (
              <Link className="rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-xl" href={`/regions/${region.slug}`} key={region.slug}>
                <p className="text-sm text-muted-foreground">{region.cities.length} городов · {region.parks.length} парков</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{region.title}</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {region.cities.slice(0, 5).map((city) => (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs" key={city.id}>{city.title}</span>
                  ))}
                  {region.cities.length > 5 ? <span className="rounded-full bg-secondary px-3 py-1 text-xs">+ ещё</span> : null}
                </div>
                <p className="mt-6 font-medium text-primary">Смотреть регион →</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </section>
    </main>
  )
}
