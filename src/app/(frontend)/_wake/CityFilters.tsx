import Link from 'next/link'

import { cableTypeLabels, featureLabels } from './labels'

export type CityFilterValues = {
  q?: string
  features: string[]
  cableTypes: string[]
  maxPrice?: string
  sort?: string
}

const featureOptions = ['training', 'equipmentRent', 'kidsSchool', 'supRent', 'cafe', 'shower', 'changingRoom', 'parking', 'beach']
const cableOptions = ['ringCable', 'reverseCable', 'boatWake', 'winch']

export function CityFilters({ citySlug, values }: { citySlug: string; values: CityFilterValues }) {
  return (
    <>
      <details className="rounded-3xl border border-border bg-card p-4 shadow-sm lg:hidden">
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Фильтры</h2>
              <p className="mt-1 text-sm text-muted-foreground">Открыть подбор по услугам, цене и типу катания.</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm">Настроить</span>
          </div>
        </summary>
        <div className="mt-5 border-t border-border pt-5">
          <FilterForm citySlug={citySlug} values={values} />
        </div>
      </details>

      <aside className="hidden rounded-3xl border border-border bg-card p-6 shadow-sm lg:block lg:sticky lg:top-24 lg:self-start">
        <FilterHeader resetHref={`/wake-parks/${citySlug}`} />
        <FilterForm citySlug={citySlug} values={values} />
      </aside>
    </>
  )
}

function FilterHeader({ resetHref }: { resetHref: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">Фильтры</h2>
        <p className="mt-1 text-sm text-muted-foreground">Подбор парка по базовым параметрам.</p>
      </div>
      <Link className="text-sm font-medium text-primary hover:underline" href={resetHref}>
        Сбросить
      </Link>
    </div>
  )
}

function FilterForm({ citySlug, values }: { citySlug: string; values: CityFilterValues }) {
  return (
    <form className="mt-5 space-y-6" method="get">
      <div className="lg:hidden">
        <FilterHeader resetHref={`/wake-parks/${citySlug}`} />
      </div>

      <label className="block">
        <span className="text-sm font-medium">Поиск</span>
        <input
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          defaultValue={values.q || ''}
          name="q"
          placeholder="Название, район, адрес..."
          type="search"
        />
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
