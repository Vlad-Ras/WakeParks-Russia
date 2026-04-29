import Link from 'next/link'

import { CityCard, EmptyCatalogHint, ParkCard } from './_wake/cards'
import { countParksByCity, getCities, getParks, getCityRefId } from './_wake/queries'
import { guides } from './guides/data'

export const metadata = {
  title: 'Wake Parks Russia — каталог вейкборд-парков России',
  description:
    'Агрегатор вейкборд-парков России: города, парки, цены, обучение, инфраструктура и контакты.',
}

export default async function HomePage() {
  const [cities, allParks] = await Promise.all([getCities(), getParks(300)])
  const parks = allParks.slice(0, 6)
  const popularCities = cities.filter((city) => city.isPopular).slice(0, 6)
  const cityCards = popularCities.length ? popularCities : cities.slice(0, 6)
  const parkCounts = countParksByCity(allParks)


  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-cyan-50 via-background to-emerald-50 dark:from-slate-950 dark:via-background dark:to-cyan-950">
        <div className="container py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium backdrop-blur">
              Каталог вейкборд-парков России
            </p>
            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
              Найди вейк-парк в своём городе
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Собираем парки по городам: цены, обучение, канатки, SUP, инфраструктура, контакты и маршруты.
              Сначала каталог, потом заявки, отзывы и продвижение парков.
            </p>
            <form className="mt-8 flex max-w-2xl flex-col gap-3 rounded-3xl border border-border bg-background/80 p-3 shadow-sm backdrop-blur sm:flex-row" action="/search">
              <input
                className="min-h-12 flex-1 rounded-2xl border border-border bg-background px-4 outline-none focus:border-primary"
                name="q"
                placeholder="Город, парк, обучение, SUP..."
                type="search"
              />
              <button className="rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground" type="submit">
                Найти
              </button>
            </form>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="/wake-parks">
                Смотреть парки
              </Link>
              <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href="/pick">
                Подобрать парк
              </Link>
              <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href="/regions">
                Регионы
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [`${cities.length}`, 'городов в каталоге'],
            [`${allParks.length}`, 'опубликованных парков'],
            ['4', 'быстрые подборки'],
            ['MVP', 'готов к наполнению'],
          ].map(([value, label]) => (
            <div className="rounded-3xl border border-border bg-card p-5" key={label}>
              <p className="text-3xl font-semibold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Города</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Популярные направления</h2>
          </div>
          <Link className="font-medium text-primary hover:underline" href="/cities">
            Все города →
          </Link>
        </div>

        {cityCards.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cityCards.map((city) => (
              <CityCard city={city} key={city.id} parksCount={parkCounts.get(getCityRefId(city) || '') || 0} />
            ))}
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="container py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Парки</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Рекомендуемые вейк-парки</h2>
            </div>
            <Link className="font-medium text-primary hover:underline" href="/wake-parks">
              Весь каталог →
            </Link>
          </div>

          {parks.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {parks.map((park) => (
                <ParkCard key={park.id} park={park} />
              ))}
            </div>
          ) : (
            <EmptyCatalogHint />
          )}
        </div>
      </section>

      <section className="container py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Подборки</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Быстрые сценарии поиска</h2>
          </div>
          <Link className="font-medium text-primary hover:underline" href="/regions">
            Смотреть регионы →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['/training', 'Новичкам', 'Парки с обучением, инструктором и арендой экипировки.'],
            ['/kids', 'Для детей', 'Площадки с детской школой и семейной инфраструктурой.'],
            ['/sup', 'SUP и отдых', 'Парки с SUP, пляжем или зоной отдыха у воды.'],
            ['/cable-wake', 'Канатки', 'Кольцевые, реверсивные канатки и лебёдки.'],
          ].map(([href, title, text]) => (
            <Link className="rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-xl" href={href} key={href}>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{text}</p>
              <p className="mt-6 font-medium text-primary">Открыть →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="container py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Гайды</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Помощь в выборе парка</h2>
            </div>
            <Link className="font-medium text-primary hover:underline" href="/guides">
              Все гайды →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {guides.map((guide) => (
              <Link className="rounded-3xl border border-border bg-background p-5 hover:bg-secondary" href={`/guides/${guide.slug}`} key={guide.slug}>
                <p className="text-sm text-muted-foreground">{guide.category} · {guide.readingTime}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{guide.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['По регионам', 'Новые страницы регионов собирают города и парки внутри области, края или республики.'],
            ['По сценариям', 'Подборки для новичков, детей, SUP-отдыха и канатного вейка помогают быстрее выбрать формат.'],
            ['Для монетизации', 'Страница рекламы описывает будущие форматы продвижения карточек и партнёрских размещений.'],
            ['Для владельцев', 'Формы добавления, обновления и подтверждения карточки помогают поддерживать данные актуальными.'],
          ].map(([title, text]) => (
            <div className="rounded-3xl border border-border bg-card p-6" key={title}>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
