import { FavoritesClient } from './FavoritesClient'

export const metadata = {
  title: 'Избранные вейк-парки — Wake Parks Russia',
  description: 'Сохранённые вейк-парки для быстрого сравнения цены, города, услуг и типа катания.',
}

export default function FavoritesPage() {
  return (
    <main className="container py-16">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Сравнение</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Избранные парки</h1>
        <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
          Сохраняй интересные вейк-парки из каталога и сравнивай их перед поездкой. Избранное хранится локально в браузере.
        </p>
      </section>

      <section className="mt-10">
        <FavoritesClient />
      </section>
    </main>
  )
}
