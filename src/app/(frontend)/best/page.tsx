import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { EmptyCatalogHint, ParkCard } from '../_wake/cards'
import { getCities, getParks } from '../_wake/queries'
import { getFreshnessInfo, sortBestParks } from '../_wake/parkMetrics'

export const metadata = {
  title: 'Лучшие вейк-парки России — рейтинг, цены и услуги',
  description:
    'Подборка лучших вейкборд-парков России по рейтингу, проверенности карточки, актуальности данных, фото, ценам и полноте информации.',
}

export default async function BestParksPage() {
  const [parks, cities] = await Promise.all([getParks(500), getCities()])
  const ranked = sortBestParks(parks)
  const top = ranked.slice(0, 12)
  const verifiedCount = parks.filter((park) => park.isVerified || park.isClaimed).length
  const freshCount = parks.filter((park) => getFreshnessInfo(park.dataQuality?.lastCheckedAt).tone === 'good').length
  const withPhotoCount = parks.filter((park) => park.cardImage || park.gallery?.length).length

  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Лучшие парки' }]} />

      <section className="mt-8 rounded-[2rem] border border-border bg-gradient-to-br from-cyan-50 via-background to-emerald-50 p-8 dark:from-slate-950 dark:via-background dark:to-cyan-950 md:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Рейтинг каталога</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Лучшие вейк-парки России</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Это не финальный пользовательский рейтинг, а внутренняя подборка MVP: учитываем оценку, фото, контакты,
            цены, подтверждение владельцем, проверенность и свежесть данных. Позже можно заменить формулу на полноценный рейтинг.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="/pick">
              Подобрать парк
            </Link>
            <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href="/wake-parks">
              Все парки
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          [`${parks.length}`, 'парков участвует'],
          [`${cities.length}`, 'городов в базе'],
          [`${verifiedCount}`, 'проверенных/подтверждённых'],
          [`${withPhotoCount}`, 'с фотографиями'],
        ].map(([value, label]) => (
          <div className="rounded-3xl border border-border bg-card p-5" key={label}>
            <p className="text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Топ карточек</h2>
            <p className="mt-2 text-muted-foreground">
              Чем полнее заполнена карточка, тем выше она поднимается в подборке.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">Свежих карточек: {freshCount}</p>
        </div>

        {top.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {top.map(({ park, score, reasons }, index) => (
              <div className="relative" key={park.id}>
                <div className="absolute left-4 top-4 z-10 rounded-full bg-black/75 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                  #{index + 1} · {score} баллов
                </div>
                <ParkCard park={park} />
                {reasons.length ? (
                  <div className="mt-3 rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Почему в подборке:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyCatalogHint />
        )}
      </section>
    </main>
  )
}
