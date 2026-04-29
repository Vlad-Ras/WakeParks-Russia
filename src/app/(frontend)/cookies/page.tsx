import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'

export const metadata = {
  title: 'Cookie — Wake Parks Russia',
  description: 'Информация об использовании cookie и локального хранилища на сайте Wake Parks Russia.',
}

export default function CookiesPage() {
  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Cookie' }]} />
      <article className="mx-auto mt-8 max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Юридический раздел</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Cookie и локальное хранилище</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          На этапе MVP сайт использует локальное хранилище браузера для пользовательских функций: избранное, сравнение парков, выбранная тема и скрытие cookie-баннера.
        </p>
        <div className="mt-8 grid gap-5">
          {[
            ['Что хранится локально', 'ID избранных парков, ID парков для сравнения, выбранная тема интерфейса и факт принятия cookie-уведомления.'],
            ['Зачем это нужно', 'Чтобы функции избранного, сравнения и темы работали без регистрации и без отдельной серверной базы.'],
            ['Как удалить', 'Можно очистить данные сайта в настройках браузера или использовать кнопки очистки на страницах избранного и сравнения.'],
            ['Аналитика', 'Перед публичным запуском, если будет подключена аналитика, нужно дополнить этот раздел информацией о Яндекс Метрике или других сервисах.'],
          ].map(([title, text]) => (
            <section className="rounded-3xl border border-border bg-card p-6" key={title}>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-muted-foreground">{text}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground" href="/privacy">Политика ПДн</Link>
          <Link className="rounded-2xl border border-border px-5 py-3 font-medium" href="/contacts">Контакты</Link>
        </div>
      </article>
    </main>
  )
}
