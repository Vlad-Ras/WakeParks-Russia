import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'

export const metadata = {
  title: 'Реклама и продвижение вейк-парков — Wake Parks Russia',
  description: 'Возможности продвижения в каталоге Wake Parks Russia: расширенная карточка, подборки, подтверждение данных и лиды.',
}

const packages = [
  {
    title: 'Базовая карточка',
    price: 'Бесплатно',
    items: ['Название и город', 'Адрес и контакты', 'Услуги', 'Цена от', 'Ссылка на маршрут'],
  },
  {
    title: 'Расширенная карточка',
    price: 'Позже',
    items: ['Галерея', 'Таблица цен', 'Бейдж подтверждения', 'Приоритет в подборках', 'Блок актуальности данных'],
  },
  {
    title: 'Продвижение',
    price: 'Позже',
    items: ['Выделение в городе', 'Попадание в подборки', 'Рекламный блок', 'Статистика переходов', 'Заявки от пользователей'],
  },
]

export default function AdvertisingPage() {
  return (
    <main className="container py-16">
      <Breadcrumbs items={[{ label: 'Реклама' }]} />
      <section className="max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Монетизация</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Реклама и продвижение парков</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Эта страница — заготовка под будущую монетизацию агрегатора. На MVP-этапе её можно использовать
          как описание возможностей для владельцев парков и партнёров.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="/for-parks">
            Подтвердить карточку
          </Link>
          <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href="/contacts">
            Связаться
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {packages.map((item) => (
          <article className="rounded-3xl border border-border bg-card p-6" key={item.title}>
            <p className="text-sm text-muted-foreground">{item.price}</p>
            <h2 className="mt-2 text-2xl font-semibold">{item.title}</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {item.items.map((feature) => (
                <li className="flex gap-3" key={feature}>
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-3xl border border-border bg-card p-8">
        <h2 className="text-2xl font-semibold">Что можно добавить позже</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            'личный кабинет владельца парка',
            'статистика просмотров и переходов',
            'платные места в городе',
            'лиды и заявки на обучение',
            'промокоды и спецпредложения',
            'партнёрские подборки с магазинами и школами',
          ].map((item) => (
            <div className="rounded-2xl bg-secondary p-4 text-sm" key={item}>{item}</div>
          ))}
        </div>
      </section>
    </main>
  )
}
