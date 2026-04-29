import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'

export const metadata = {
  title: 'Заявка владельца отправлена — Wake Parks Russia',
  description: 'Что происходит после отправки заявки владельца вейк-парка и как ускорить подтверждение карточки.',
}

type Args = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ClaimSuccessPage({ searchParams: searchParamsPromise }: Args) {
  const searchParams = (await searchParamsPromise) || {}
  const park = Array.isArray(searchParams.park) ? searchParams.park[0] : searchParams.park

  return (
    <main className="container py-12 md:py-20">
      <Breadcrumbs items={[{ href: '/for-parks', label: 'Для парков' }, { label: 'Заявка отправлена' }]} />

      <section className="rounded-[2rem] border border-border bg-gradient-to-br from-emerald-50 via-background to-cyan-50 p-6 md:p-10 dark:from-emerald-950 dark:via-background dark:to-cyan-950">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Заявка принята</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Теперь карточку можно проверить и подтвердить</h1>
        <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
          Заявка сохранена в админке в разделе «Wake каталог → Заявки владельцев». На MVP-этапе проверка и обновление карточки выполняются вручную.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="/update-park">
            Отправить правку по данным
          </Link>
          <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium hover:bg-secondary" href="/owner-guide">
            Открыть гайд владельца
          </Link>
          <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium hover:bg-secondary" href="/wake-parks">
            Вернуться в каталог
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Step title="1. Проверить источник" text="Администратор сверяет сайт, соцсети, карты или другой источник, который подтверждает связь с парком." />
        <Step title="2. Обновить карточку" text="После проверки можно обновить цены, контакты, фото, график, услуги и дату последней проверки данных." />
        <Step title="3. Включить бейдж" text="Если заявка подтверждена, у карточки можно включить бейдж «Подтверждено владельцем»." />
      </section>

      <section className="mt-8 rounded-3xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Как ускорить проверку</h2>
        <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <p>• ссылка на официальный сайт или VK с тем же телефоном ускоряет подтверждение;</p>
          <p>• актуальный прайс можно отправить через страницу «Обновить данные»;</p>
          <p>• для фото лучше указывать ссылки на официальные альбомы или облако;</p>
          <p>• если парк ещё не опубликован, сначала добавь его через форму «Добавить парк».</p>
        </div>
        {park ? <p className="mt-4 text-xs text-muted-foreground">ID выбранного парка в заявке: {park}</p> : null}
      </section>
    </main>
  )
}

function Step({ text, title }: { text: string; title: string }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </article>
  )
}
