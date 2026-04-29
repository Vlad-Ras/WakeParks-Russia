'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { cableTypeLabels, featureLabels } from '../_wake/labels'
import { clearFavorites, readFavorites, removeFavorite, type FavoriteParkSnapshot } from '../_wake/FavoriteButton'

export function FavoritesClient() {
  const [favorites, setFavorites] = useState<FavoriteParkSnapshot[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    function sync() {
      setFavorites(readFavorites())
      setIsReady(true)
    }

    sync()
    window.addEventListener('wakeparks:favorites-updated', sync)
    window.addEventListener('storage', sync)

    return () => {
      window.removeEventListener('wakeparks:favorites-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const stats = useMemo(() => {
    const cities = new Set(favorites.map((item) => item.cityTitle).filter(Boolean))
    const minPrice = favorites
      .map((item) => item.priceFrom)
      .filter((price): price is number => typeof price === 'number' && Number.isFinite(price))
      .sort((a, b) => a - b)[0]

    return {
      citiesCount: cities.size,
      minPrice,
    }
  }, [favorites])

  if (!isReady) {
    return <div className="rounded-3xl border border-border bg-card p-8 text-muted-foreground">Загружаем избранное...</div>
  }

  if (!favorites.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
        <h2 className="text-2xl font-semibold">В избранном пока пусто</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Открой каталог парков и нажми «В избранное» на карточках, которые хочешь сравнить позже.
        </p>
        <Link className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground" href="/wake-parks">
          Открыть каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Сохранено парков" value={String(favorites.length)} />
        <StatCard label="Городов" value={String(stats.citiesCount)} />
        <StatCard label="Минимальная цена" value={stats.minPrice ? `от ${stats.minPrice} ₽` : 'уточняется'} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5">
        <div>
          <h2 className="text-xl font-semibold">Сравнение выбранных парков</h2>
          <p className="mt-1 text-sm text-muted-foreground">Данные хранятся только в браузере на этом устройстве.</p>
        </div>
        <button className="rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-secondary" onClick={() => clearFavorites()} type="button">
          Очистить избранное
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {favorites.map((park) => (
          <article className="rounded-3xl border border-border bg-card p-6" key={park.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{park.cityTitle || 'Город не указан'}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{park.title}</h3>
              </div>
              <button className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary" onClick={() => removeFavorite(park.id)} type="button">
                Убрать
              </button>
            </div>

            {park.summary && <p className="mt-4 line-clamp-3 text-muted-foreground">{park.summary}</p>}

            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Цена" value={park.priceFrom ? `от ${park.priceFrom} ₽` : 'уточняется'} />
              <Info label="Рейтинг" value={park.rating ? `★ ${park.rating}` : 'нет данных'} />
              <Info label="Адрес" value={park.address || 'не указан'} />
            </dl>

            {park.cableTypes?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {park.cableTypes.map((type) => (
                  <span className="rounded-full border border-border px-3 py-1 text-xs" key={type}>
                    {cableTypeLabels[type] || type}
                  </span>
                ))}
              </div>
            ) : null}

            {park.features?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {park.features.map((feature) => (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs" key={feature}>
                    {featureLabels[feature] || feature}
                  </span>
                ))}
              </div>
            ) : null}

            <Link className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground" href={park.href}>
              Открыть карточку
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
