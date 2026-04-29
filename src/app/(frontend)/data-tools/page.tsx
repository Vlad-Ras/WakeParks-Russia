import type { Metadata } from 'next'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { DataToolsClient } from './DataToolsClient'

export const metadata: Metadata = {
  title: 'Импорт и экспорт данных — Wake Parks Russia',
  description: 'Инструменты для локального импорта и экспорта городов, парков и цен агрегатора Wake Parks Russia.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DataToolsPage() {
  return (
    <main className="container py-10 md:py-16">
      <Breadcrumbs items={[{ label: 'Импорт / экспорт' }]} />
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Инструменты данных</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Импорт и экспорт каталога</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Быстрый способ перенести базу городов, парков и цен без ручного кликанья в админке. Для безопасности импорт работает только с токеном из .env.
        </p>
      </div>
      <DataToolsClient />
    </main>
  )
}
