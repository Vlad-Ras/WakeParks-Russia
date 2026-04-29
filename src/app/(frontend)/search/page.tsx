import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { ParkCard } from '../_wake/cards'
import { getCityFromPark, getCities, getParks } from '../_wake/queries'
import { guides } from '../guides/data'

type Args = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export const metadata: Metadata = {
  title: 'Поиск — Wake Parks Russia',
  description: 'Поиск по городам, вейк-паркам, адресам, услугам и гайдам Wake Parks Russia.',
}

export default async function SearchPage({ searchParams: searchParamsPromise }: Args) {
  const searchParams = (await searchParamsPromise) || {}
  const query = asString(searchParams.q).trim()
  const normalizedQuery = query.toLowerCase()
  const [cities, parks] = await Promise.all([getCities(), getParks(500)])

  const cityResults = normalizedQuery
    ? cities.filter((city) => [city.title, city.region, city.summary].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery))
    : []

  const parkResults = normalizedQuery
    ? parks.filter((park) => {
        const city = getCityFromPark(park)
        return [
          park.title,
          park.summary,
          park.description,
          city?.title,
          city?.region,
          park.location?.address,
          park.location?.district,
          park.workTime,
          park.season,
          ...(park.cableTypes || []),
          ...Object.keys(park.features || {}).filter((key) => park.features?.[key]),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      })
    : []

  const guideResults = normalizedQuery
    ? guides.filter((guide) =>
        [guide.title, guide.description, guide.category, guide.intro, ...guide.sections.map((section) => `${section.title} ${section.text}`)]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : []

  const total = cityResults.length + parkResults.length + guideResults.length

  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ label: 'Поиск' }]} />
      <section className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Поиск</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Поиск по каталогу</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Ищи город, парк, адрес, тип катания, услугу или полезный материал. Например: “Москва”, “SUP”, “обучение”, “кольцевая”.
        </p>
      </section>

      <form className="mt-8 flex max-w-3xl flex-col gap-3 rounded-3xl border border-border bg-card p-4 md:flex-row" action="/search">
        <input
          className="min-h-12 flex-1 rounded-2xl border border-border bg-background px-4 outline-none focus:border-primary"
          defaultValue={query}
          name="q"
          placeholder="Введите город, парк или услугу"
          type="search"
        />
        <button className="rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground" type="submit">
          Найти
        </button>
      </form>

      {!query ? (
        <section className="mt-10 rounded-3xl border border-dashed border-border bg-card p-8">
          <h2 className="text-2xl font-semibold">Начни с поискового запроса</h2>
          <p className="mt-3 text-muted-foreground">
            Поиск работает по городам, карточкам парков, адресам, описаниям, типам катания, услугам и гайдам.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Москва', 'обучение', 'SUP', 'кафе', 'реверсивная канатка', 'новичкам'].map((item) => (
              <Link className="rounded-full bg-secondary px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground" href={`/search?q=${encodeURIComponent(item)}`} key={item}>
                {item}
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-10 space-y-10">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-secondary px-4 py-2">Запрос: {query}</span>
            <span className="rounded-full bg-secondary px-4 py-2">Найдено: {total}</span>
          </div>

          {parkResults.length ? (
            <ResultBlock title="Парки">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {parkResults.map((park) => (
                  <ParkCard key={park.id} park={park} />
                ))}
              </div>
            </ResultBlock>
          ) : null}

          {cityResults.length ? (
            <ResultBlock title="Города">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cityResults.map((city) => (
                  <Link className="rounded-3xl border border-border bg-card p-5 hover:bg-secondary" href={`/wake-parks/${city.slug}`} key={city.id}>
                    <p className="text-sm text-muted-foreground">{city.region || 'Россия'}</p>
                    <h2 className="mt-2 text-2xl font-semibold">{city.title}</h2>
                    {city.summary ? <p className="mt-3 line-clamp-3 text-muted-foreground">{city.summary}</p> : null}
                  </Link>
                ))}
              </div>
            </ResultBlock>
          ) : null}

          {guideResults.length ? (
            <ResultBlock title="Гайды">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {guideResults.map((guide) => (
                  <Link className="rounded-3xl border border-border bg-card p-5 hover:bg-secondary" href={`/guides/${guide.slug}`} key={guide.slug}>
                    <p className="text-sm text-muted-foreground">{guide.category} · {guide.readingTime}</p>
                    <h2 className="mt-2 text-xl font-semibold">{guide.title}</h2>
                    <p className="mt-3 line-clamp-3 text-muted-foreground">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </ResultBlock>
          ) : null}

          {!total ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
              <h2 className="text-2xl font-semibold">Ничего не найдено</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Попробуй другой запрос или перейди в общий каталог парков.
              </p>
              <Link className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground" href="/wake-parks">
                Открыть каталог
              </Link>
            </div>
          ) : null}
        </section>
      )}
    </main>
  )
}

function ResultBlock({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section>
      <h2 className="mb-5 text-3xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || ''
  return value || ''
}
