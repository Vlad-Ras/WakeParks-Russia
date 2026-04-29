import Link from 'next/link'

import { Breadcrumbs } from './Breadcrumbs'
import { EmptyCatalogHint, ParkCard } from './cards'
import type { ParkDoc } from './queries'

export type ThemeLandingConfig = {
  title: string
  eyebrow: string
  description: string
  emptyTitle: string
  emptyDescription: string
  guideHref?: string
  guideLabel?: string
  chips: string[]
  checklist: string[]
}

export function ThemeLanding({ config, parks }: { config: ThemeLandingConfig; parks: ParkDoc[] }) {
  return (
    <main>
      <section className="border-b border-border bg-gradient-to-br from-cyan-50 via-background to-emerald-50 dark:from-slate-950 dark:via-background dark:to-cyan-950">
        <div className="container py-14 md:py-20">
          <Breadcrumbs items={[{ label: config.title }]} />
          <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">{config.eyebrow}</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">{config.title}</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">{config.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {config.chips.map((chip) => (
              <span className="rounded-full bg-background/80 px-4 py-2 text-sm shadow-sm" key={chip}>{chip}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="/wake-parks">
              Весь каталог
            </Link>
            <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href="/pick">
              Подобрать парк
            </Link>
            {config.guideHref ? (
              <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href={config.guideHref}>
                {config.guideLabel || 'Читать гайд'}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Подборка</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Подходящие парки</h2>
              </div>
              <span className="rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
                Найдено: {parks.length}
              </span>
            </div>

            {parks.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {parks.map((park) => (
                  <ParkCard key={park.id} park={park} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
                <h2 className="text-2xl font-semibold">{config.emptyTitle}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{config.emptyDescription}</p>
                <div className="mt-6">
                  <EmptyCatalogHint />
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Перед поездкой</p>
            <h2 className="mt-2 text-2xl font-semibold">Что проверить</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {config.checklist.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground" href="/update-park">
              Сообщить об ошибке в данных
            </Link>
          </aside>
        </div>
      </section>
    </main>
  )
}
