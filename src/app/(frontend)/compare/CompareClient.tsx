'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { cableTypeLabels, featureLabels } from '../_wake/labels'
import {
  clearCompareParks,
  readCompareParks,
  removeComparePark,
  type CompareParkSnapshot,
} from '../_wake/CompareButton'

const compareRows: Array<{
  label: string
  getValue: (park: CompareParkSnapshot) => string
}> = [
  { label: 'Город', getValue: (park) => park.cityTitle || 'Не указан' },
  { label: 'Цена', getValue: (park) => (park.priceFrom ? `от ${park.priceFrom} ₽` : 'Уточняется') },
  { label: 'Рейтинг', getValue: (park) => (park.rating ? `★ ${park.rating}` : 'Нет данных') },
  { label: 'Адрес', getValue: (park) => park.address || 'Не указан' },
  {
    label: 'Типы катания',
    getValue: (park) => park.cableTypes?.map((type) => cableTypeLabels[type] || type).join(', ') || 'Не указаны',
  },
  {
    label: 'Услуги',
    getValue: (park) => park.features?.map((feature) => featureLabels[feature] || feature).join(', ') || 'Не указаны',
  },
]

export function CompareClient() {
  const [items, setItems] = useState<CompareParkSnapshot[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    function sync() {
      setItems(readCompareParks())
      setIsReady(true)
    }

    sync()
    window.addEventListener('wakeparks:compare-updated', sync)
    window.addEventListener('storage', sync)

    return () => {
      window.removeEventListener('wakeparks:compare-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const stats = useMemo(() => {
    const cities = new Set(items.map((item) => item.cityTitle).filter(Boolean))
    const prices = items
      .map((item) => item.priceFrom)
      .filter((price): price is number => typeof price === 'number' && Number.isFinite(price))
      .sort((a, b) => a - b)

    return {
      citiesCount: cities.size,
      minPrice: prices[0],
      maxPrice: prices[prices.length - 1],
    }
  }, [items])

  if (!isReady) {
    return <div className="rounded-3xl border border-border bg-card p-8 text-muted-foreground">Загружаем сравнение...</div>
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
        <h2 className="text-2xl font-semibold">В сравнении пока пусто</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Открой каталог парков и нажми «Сравнить». В таблицу можно добавить до 4 парков одновременно.
        </p>
        <Link className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground" href="/wake-parks">
          Открыть каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="В сравнении" value={String(items.length)} />
        <StatCard label="Городов" value={String(stats.citiesCount)} />
        <StatCard label="Минимальная цена" value={stats.minPrice ? `от ${stats.minPrice} ₽` : 'уточняется'} />
        <StatCard label="Максимальная цена" value={stats.maxPrice ? `от ${stats.maxPrice} ₽` : 'уточняется'} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5">
        <div>
          <h2 className="text-xl font-semibold">Таблица сравнения</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Сравнение хранится только в браузере. Для публичной версии позже можно сделать шаринг ссылкой.
          </p>
        </div>
        <button className="rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-secondary" onClick={() => clearCompareParks()} type="button">
          Очистить сравнение
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-card">
        <table className="min-w-[920px] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left align-top">
              <th className="w-48 p-4 font-medium">Параметр</th>
              {items.map((park) => (
                <th className="min-w-56 p-4" key={park.id}>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="text-xs font-normal text-muted-foreground">{park.cityTitle || 'Город не указан'}</p>
                      <p className="text-lg font-semibold">{park.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground" href={park.href}>
                        Открыть
                      </Link>
                      <button className="rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-background" onClick={() => removeComparePark(park.id)} type="button">
                        Убрать
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr className="border-b border-border align-top last:border-b-0" key={row.label}>
                <th className="bg-secondary/30 p-4 text-left font-medium">{row.label}</th>
                {items.map((park) => (
                  <td className="p-4 text-muted-foreground" key={`${park.id}-${row.label}`}>
                    {row.getValue(park)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Как пользоваться</h2>
        <p className="mt-3 text-muted-foreground">
          Добавляй в сравнение похожие по городу или формату парки: например, 2–3 реверсивные канатки или несколько парков с обучением для новичков. Так проще понять, куда ехать по цене, инфраструктуре и типу катания.
        </p>
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
