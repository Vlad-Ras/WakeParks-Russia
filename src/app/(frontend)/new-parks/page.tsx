import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { EmptyCatalogHint, ParkCard } from '../_wake/cards'
import { getCityFromPark, getParks } from '../_wake/queries'
import { formatDate, sortNewestParks } from '../_wake/parkMetrics'

export const metadata = {
  title: 'Новые вейк-парки в каталоге — Wake Parks Russia',
  description:
    'Новые карточки вейкборд-парков, добавленные в каталог Wake Parks Russia. Города, цены, услуги, контакты и маршруты.',
}

export default async function NewParksPage() {
  const parks = sortNewestParks(await getParks(500)).slice(0, 24)

  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Новые парки' }]} />

      <section className="mt-8 grid gap-8 rounded-[2rem] border border-border bg-card p-8 md:grid-cols-[1.4fr_0.8fr] md:p-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Обновления каталога</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Новые парки</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Здесь собраны последние опубликованные карточки. Раздел полезен, когда каталог начнёт активно пополняться
            владельцами парков и модераторами.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="/add-park">
              Добавить парк
            </Link>
            <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href="/recently-updated">
              Недавно обновлено
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-background p-6">
          <p className="text-3xl font-semibold">{parks.length}</p>
          <p className="mt-2 text-muted-foreground">последних карточек готово к просмотру</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Сортировка идёт по дате создания карточки, а если её нет — по последнему обновлению записи.
          </p>
        </div>
      </section>

      <section className="mt-12">
        {parks.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {parks.map((park) => {
              const city = getCityFromPark(park)
              return (
                <div key={park.id}>
                  <div className="mb-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Добавлено:</span> {formatDate(park.createdAt || park.updatedAt)}
                    {city?.title ? <span> · {city.title}</span> : null}
                  </div>
                  <ParkCard park={park} />
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </section>
    </main>
  )
}
