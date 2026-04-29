import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { CompareClient } from './CompareClient'

export const metadata: Metadata = {
  title: 'Сравнение вейк-парков — Wake Parks Russia',
  description: 'Сравни выбранные вейк-парки по городу, цене, рейтингу, адресу, типу катания и услугам.',
}

export default function ComparePage() {
  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ label: 'Сравнение' }]} />
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Подбор</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Сравнение вейк-парков</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            Добавляй парки из каталога в сравнение и смотри ключевые параметры в одной таблице.
          </p>
        </div>
        <Link className="rounded-full bg-primary px-5 py-3 text-center font-medium text-primary-foreground" href="/wake-parks">
          Добавить парк
        </Link>
      </div>

      <CompareClient />
    </main>
  )
}
