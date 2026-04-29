import Link from 'next/link'

import { getCities } from '../_wake/queries'
import { AddParkForm } from './AddParkForm'

export const metadata = {
  title: 'Добавить вейк-парк — Wake Parks Russia',
  description: 'Публичная форма добавления вейк-парка в каталог Wake Parks Russia.',
}

export default async function AddParkPage() {
  const cities = await getCities()

  return (
    <main className="container py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Для владельцев и пользователей</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Добавить вейк-парк</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            Заполни форму — парк попадёт в админку со статусом «На модерации». После проверки его можно опубликовать в каталоге.
          </p>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Как это работает</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>1. Пользователь отправляет данные парка.</li>
            <li>2. В Payload создаётся карточка парка и строки цен со статусом «На модерации».</li>
            <li>3. Админ проверяет контакты, цены, описание и ссылки на фотографии.</li>
            <li>4. После статуса «Опубликовано» парк появляется на сайте.</li>
          </ol>
          <div className="mt-6 flex flex-col gap-3">
            <Link className="rounded-full bg-primary px-5 py-3 text-center font-medium text-primary-foreground" href="/admin">
              Открыть админку
            </Link>
            <Link className="rounded-full border border-border px-5 py-3 text-center font-medium" href="/wake-parks">
              Смотреть каталог
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt-10">
        <AddParkForm cities={cities} />
      </div>
    </main>
  )
}
