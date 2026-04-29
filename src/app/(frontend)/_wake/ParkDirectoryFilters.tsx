import Link from 'next/link'

import type { CityDoc } from './queries'
import { cableTypeLabels, featureLabels } from './labels'

export type ParkDirectoryFilterValues = {
  q?: string
  city?: string
  features: string[]
  cableTypes: string[]
  maxPrice?: string
  sort?: string
}

const featureOptions = ['training', 'equipmentRent', 'kidsSchool', 'supRent', 'cafe', 'shower', 'changingRoom', 'parking', 'beach']
const cableOptions = ['ringCable', 'reverseCable', 'boatWake', 'winch']

export function ParkDirectoryFilters({ cities, values }: { cities: CityDoc[]; values: ParkDirectoryFilterValues }) {
  const sortedCities = [...cities].sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'ru'))

  return (
    <>
      <details className="rounded-3xl border border-border bg-card p-4 shadow-sm lg:hidden">
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Фильтры</h2>
              <p className="mt-1 text-sm text-muted-foreground">Открыть подбор по городу, цене, услугам и типу катания.</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm">Настроить</span>
          </div>
        </summary>
        <div className="mt-5 border-t border-border pt-5">
          <FilterForm cities={sortedCities} values={values} />
        </div>
      </details>

      <aside className="hidden rounded-3xl border border-border bg-card p-6 shadow-sm lg:block lg:sticky lg:top-24 lg:self-start">
        <FilterHeader />
        <FilterForm cities={sortedCities} values={values} />
      </aside>
    </>
  )
}

function FilterHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">Фильтры</h2>
        <p className="mt-1 text-sm text-muted-foreground">Подбор среди всех парков каталога.</p>
      </div>
      <Link className="text-sm font-medium text-primary hover:underline" href="/wake-parks">
        Сбросить
      </Link>
    </div>
  )
}

function FilterForm({ cities, values }: { cities: CityDoc[]; values: ParkDirectoryFilterValues }) {
  return (
    <form className="mt-5 space-y-6" method="get">
      <div className="lg:hidden">
        <FilterHeader />
      </div>

      <label className="block">
        <span className="text-sm font-medium">Поиск</span>
        <input
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          defaultValue={values.q || ''}
          name="q"
          placeholder="Название, город, район, адрес..."
          type="search"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Город</span>
        <select
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          defaultValue={values.city || ''}
          name="city"
        >
          <option value="">Все города</option>
          {cities.map((city) => (
            <option key={city.id} value={city.slug || ''}>
              {city.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Максимальная цена от</span>
        <input
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          defaultValue={values.maxPrice || ''}
          min="0"
          name="maxPrice"
          placeholder="Например: 1000"
          type="number"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Сортировка</span>
        <select
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          defaultValue={values.sort || 'featured'}
          name="sort"
        >
          <option value="featured">Сначала рекомендуемые</option>
          <option value="ratingDesc">Сначала высокий рейтинг</option>
          <option value="priceAsc">Сначала дешевле</option>
          <option value="priceDesc">Сначала дороже</option>
          <option value="titleAsc">По названию</option>
        </select>
      </label>

      <fieldset>
        <legend className="text-sm font-medium">Услуги</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {featureOptions.map((feature) => (
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-3 py-2 text-sm transition hover:border-primary/40" key={feature}>
              <input className="size-4 accent-current" defaultChecked={values.features.includes(feature)} name="feature" type="checkbox" value={feature} />
              <span>{featureLabels[feature] || feature}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Тип катания</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {cableOptions.map((type) => (
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-3 py-2 text-sm transition hover:border-primary/40" key={type}>
              <input className="size-4 accent-current" defaultChecked={values.cableTypes.includes(type)} name="cable" type="checkbox" value={type} />
              <span>{cableTypeLabels[type] || type}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button className="w-full rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90" type="submit">
        Применить
      </button>
    </form>
  )
}
