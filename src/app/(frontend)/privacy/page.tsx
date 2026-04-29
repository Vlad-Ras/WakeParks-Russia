import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'

export const metadata = {
  title: 'Политика обработки персональных данных — Wake Parks Russia',
  description: 'Черновик политики обработки персональных данных для MVP сайта Wake Parks Russia.',
}

const sections = [
  {
    title: '1. Общие положения',
    text: 'Эта страница является MVP-заготовкой политики обработки персональных данных. Перед публичным запуском её нужно заменить на финальный юридический текст с реальными реквизитами оператора.',
  },
  {
    title: '2. Какие данные собираются',
    text: 'Через формы сайта могут передаваться имя, телефон, email, Telegram, комментарии, сведения о парке, ссылки на источники и другая информация, которую пользователь вводит самостоятельно.',
  },
  {
    title: '3. Зачем используются данные',
    text: 'Данные используются для обработки обращений, модерации карточек парков, связи с отправителем, уточнения информации, подтверждения владельца парка и улучшения качества каталога.',
  },
  {
    title: '4. Кто получает доступ',
    text: 'Доступ к данным получают только администраторы сайта. Данные отправителей не публикуются на публичных страницах без отдельного согласия.',
  },
  {
    title: '5. Срок хранения',
    text: 'На этапе MVP срок хранения определяется администратором проекта. Перед продакшеном нужно установить понятные сроки хранения обращений, отзывов и заявок.',
  },
  {
    title: '6. Права пользователя',
    text: 'Пользователь может запросить удаление или уточнение отправленных данных через страницу контактов проекта.',
  },
]

export default function PrivacyPage() {
  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Политика персональных данных' }]} />
      <article className="mx-auto mt-8 max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Юридический раздел</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Политика обработки персональных данных</h1>
        <p className="mt-5 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
          Важно: это рабочая заготовка для MVP. Перед реальным публичным запуском текст нужно согласовать с юристом и добавить реквизиты оператора персональных данных.
        </p>
        <div className="mt-8 grid gap-5">
          {sections.map((section) => (
            <section className="rounded-3xl border border-border bg-card p-6" key={section.title}>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-muted-foreground">{section.text}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground" href="/contacts">Связаться</Link>
          <Link className="rounded-2xl border border-border px-5 py-3 font-medium" href="/terms">Пользовательское соглашение</Link>
        </div>
      </article>
    </main>
  )
}
