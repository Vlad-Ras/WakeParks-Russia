import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'

export const metadata = {
  title: 'О проекте — Wake Parks Russia',
  description: 'Wake Parks Russia — агрегатор вейкборд-парков России по городам, ценам, услугам и маршрутам.',
}

export default function AboutPage() {
  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'О проекте' }]} />
      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">О проекте</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Агрегатор вейкборд-парков России</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Wake Parks Russia помогает быстро найти площадку для вейкборда в нужном городе: посмотреть цены, обучение, тип канатки, инфраструктуру, контакты и маршрут.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Для райдеров', 'Поиск парков, фильтры, сравнение, избранное и подбор по параметрам.'],
              ['Для новичков', 'Гайды, цены, обучение, аренда оборудования и понятные карточки парков.'],
              ['Для владельцев', 'Добавление карточки, правки, подтверждение данных и будущие заявки.'],
            ].map(([title, text]) => (
              <div className="rounded-3xl border border-border bg-card p-5" key={title}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Что важно</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Проект не заменяет официальный сайт парка. Данные в каталоге нужно регулярно сверять с владельцами, соцсетями, картами и официальными источниками.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Link className="rounded-2xl bg-primary px-5 py-3 text-center font-medium text-primary-foreground" href="/wake-parks">
              Смотреть каталог
            </Link>
            <Link className="rounded-2xl border border-border px-5 py-3 text-center font-medium" href="/for-parks">
              Я владелец парка
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}
