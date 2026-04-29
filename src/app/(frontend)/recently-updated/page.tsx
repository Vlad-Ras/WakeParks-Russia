import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { EmptyCatalogHint, ParkCard } from '../_wake/cards'
import { getParks } from '../_wake/queries'
import { formatDate, getFreshnessInfo, sortRecentlyUpdatedParks } from '../_wake/parkMetrics'

export const metadata = {
  title: 'Недавно обновлённые вейк-парки — актуальные карточки',
  description:
    'Карточки вейкборд-парков, которые недавно проверялись или обновлялись: цены, контакты, услуги, график и маршруты.',
}

export default async function RecentlyUpdatedPage() {
  const parks = sortRecentlyUpdatedParks(await getParks(500)).slice(0, 24)

  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Недавно обновлено' }]} />

      <section className="mt-8 rounded-[2rem] border border-border bg-gradient-to-br from-emerald-50 via-background to-cyan-50 p-8 dark:from-slate-950 dark:via-background dark:to-emerald-950 md:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Актуальность данных</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Недавно обновлённые карточки</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Страница помогает следить за качеством каталога: какие парки проверяли недавно, какие требуют перепроверки,
            где стоит уточнить цены или контакты перед сезоном.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="/update-park">
              Сообщить обновление
            </Link>
            <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href="/for-parks">
              Для владельцев
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12">
        {parks.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {parks.map((park) => {
              const freshness = getFreshnessInfo(park.dataQuality?.lastCheckedAt)
              const toneClass = {
                good: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
                ok: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200',
                warn: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
                bad: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
                muted: 'bg-secondary text-secondary-foreground',
              }[freshness.tone]

              return (
                <div key={park.id}>
                  <div className="mb-3 rounded-2xl border border-border bg-card p-4 text-sm">
                    <span className={`inline-flex rounded-full px-3 py-1 font-medium ${toneClass}`}>{freshness.label}</span>
                    <p className="mt-3 text-muted-foreground">
                      Последняя проверка: <span className="text-foreground">{formatDate(park.dataQuality?.lastCheckedAt)}</span>
                    </p>
                    {park.dataQuality?.freshnessNote ? (
                      <p className="mt-2 text-muted-foreground">{park.dataQuality.freshnessNote}</p>
                    ) : null}
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
