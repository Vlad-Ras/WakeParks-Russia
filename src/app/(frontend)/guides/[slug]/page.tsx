import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '../../_wake/Breadcrumbs'
import { getGuideBySlug, guides } from '../data'

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }))
}

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const guide = getGuideBySlug(decodeURIComponent(slug))

  if (!guide) return { title: 'Гайд не найден — Wake Parks Russia' }

  return {
    title: `${guide.title} — Wake Parks Russia`,
    description: guide.description,
  }
}

export default async function GuidePage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const guide = getGuideBySlug(decodeURIComponent(slug))

  if (!guide) notFound()

  const related = guides.filter((item) => item.slug !== guide.slug).slice(0, 3)

  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ href: '/guides', label: 'Гайды' }, { label: guide.title }]} />
      <article className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-secondary px-3 py-1">{guide.category}</span>
          <span>{guide.readingTime}</span>
          <span>Обновлено: {formatDate(guide.updatedAt)}</span>
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">{guide.title}</h1>
        <p className="mt-6 text-xl text-muted-foreground">{guide.intro}</p>

        <div className="mt-10 space-y-6">
          {guide.sections.map((section) => (
            <section className="rounded-3xl border border-border bg-card p-6" key={section.title}>
              <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
              <p className="mt-4 whitespace-pre-wrap text-muted-foreground">{section.text}</p>
              {section.items?.length ? (
                <ul className="mt-5 grid gap-2 text-muted-foreground">
                  {section.items.map((item) => (
                    <li className="flex gap-3" key={item}>
                      <span className="mt-2 size-2 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>

      {related.length ? (
        <section className="mx-auto mt-14 max-w-5xl">
          <h2 className="text-2xl font-semibold tracking-tight">Ещё материалы</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link className="rounded-3xl border border-border bg-card p-5 hover:bg-secondary" href={`/guides/${item.slug}`} key={item.slug}>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="mt-2 font-semibold">{item.title}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value))
}
