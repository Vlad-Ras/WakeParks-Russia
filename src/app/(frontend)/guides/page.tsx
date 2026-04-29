import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { guides } from './data'

export const metadata = {
  title: 'Гайды по вейкборду — Wake Parks Russia',
  description: 'Полезные материалы для выбора вейк-парка: новичкам, родителям, владельцам парков и райдерам.',
}

export default function GuidesPage() {
  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ label: 'Гайды' }]} />
      <section className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Гайды</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Полезное про вейкборд и парки</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Короткие материалы для SEO и пользователей: как выбрать парк, что взять с собой, чем отличаются типы катания и как добавить парк в каталог.
        </p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide) => (
          <Link
            className="group rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-xl"
            href={`/guides/${guide.slug}`}
            key={guide.slug}
          >
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1">{guide.category}</span>
              <span>{guide.readingTime}</span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight group-hover:text-primary">{guide.title}</h2>
            <p className="mt-3 text-muted-foreground">{guide.description}</p>
            <p className="mt-6 font-medium text-primary">Читать →</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
