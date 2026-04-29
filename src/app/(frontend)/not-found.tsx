import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <main className="container py-24">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-cyan-50 via-background to-emerald-50 p-8 text-center dark:from-slate-950 dark:via-background dark:to-cyan-950 md:p-14">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">Ошибка 404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">Страница не найдена</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Такой страницы нет или она была перенесена. Можно вернуться на главную, открыть каталог парков или выбрать город.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="/">
            На главную
          </Link>
          <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href="/wake-parks">
            Смотреть парки
          </Link>
          <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium" href="/cities">
            Выбрать город
          </Link>
        </div>
      </section>
    </main>
  )
}
