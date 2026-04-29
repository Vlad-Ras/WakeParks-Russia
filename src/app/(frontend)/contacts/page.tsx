import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { ContactForm } from './ContactForm'

export const metadata = {
  title: 'Контакты — Wake Parks Russia',
  description: 'Связаться с проектом Wake Parks Russia: вопросы по каталогу, партнёрство, обновление данных и реклама.',
}

export default function ContactsPage() {
  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Контакты' }]} />

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Связь</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Контакты проекта</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Напиши, если нужно добавить парк, обновить данные, обсудить партнёрство, рекламу или сообщить об ошибке в каталоге.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ['Добавить парк', 'Для новых площадок и владельцев', '/add-park'],
              ['Обновить данные', 'Цены, график, контакты, фото', '/update-park'],
              ['Для владельцев', 'Подтверждение карточки и партнёрство', '/for-parks'],
              ['Импорт / экспорт', 'Служебные инструменты наполнения', '/data-tools'],
            ].map(([title, text, href]) => (
              <Link className="rounded-3xl border border-border bg-card p-5 hover:bg-secondary" href={href} key={href}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Перед публичным запуском</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Реквизиты, юридическое лицо, email и телефоны проекта нужно будет заменить на реальные. Сейчас страница работает как MVP-заготовка.
          </p>
          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground">
            <li>• обращения сохраняются в Payload CMS;</li>
            <li>• публично данные отправителей не выводятся;</li>
            <li>• форма содержит honeypot от простого спама;</li>
            <li>• для продакшена позже добавим капчу и email/Telegram-уведомления.</li>
          </ul>
        </aside>
      </section>

      <section className="mt-10">
        <ContactForm />
      </section>
    </main>
  )
}
