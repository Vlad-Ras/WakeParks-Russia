'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { cableTypeLabels, featureGroups, featureLabels } from '../_wake/labels'

type MapCity = {
  id: string
  title: string
  slug: string
}

type MapPark = {
  id: string
  title: string
  slug: string
  cityTitle: string
  citySlug: string
  summary?: string
  priceFrom?: number
  rating?: number
  address?: string
  district?: string
  lat?: number
  lng?: number
  yandexMapsUrl?: string
  cableTypes: string[]
  features: string[]
}

const cableOptions = Object.entries(cableTypeLabels)
const featureOptions = featureGroups.flatMap((group) => group.keys.map((key) => ({ key, group: group.title, label: featureLabels[key] || key })))

export function MapExplorer({ cities, parks }: { cities: MapCity[]; parks: MapPark[] }) {
  const [query, setQuery] = useState('')
  const [citySlug, setCitySlug] = useState('')
  const [selectedId, setSelectedId] = useState(parks[0]?.id || '')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedCableTypes, setSelectedCableTypes] = useState<string[]>([])
  const [showOnlyWithCoordinates, setShowOnlyWithCoordinates] = useState(false)

  const filteredParks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return parks.filter((park) => {
      if (citySlug && park.citySlug !== citySlug) return false
      if (showOnlyWithCoordinates && !hasCoordinates(park)) return false

      if (selectedFeatures.length && !selectedFeatures.every((feature) => park.features.includes(feature))) return false
      if (selectedCableTypes.length && !selectedCableTypes.some((type) => park.cableTypes.includes(type))) return false

      if (normalizedQuery) {
        const haystack = [
          park.title,
          park.cityTitle,
          park.summary,
          park.address,
          park.district,
          ...park.features.map((feature) => featureLabels[feature] || feature),
          ...park.cableTypes.map((type) => cableTypeLabels[type] || type),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        if (!haystack.includes(normalizedQuery)) return false
      }

      return true
    })
  }, [citySlug, parks, query, selectedCableTypes, selectedFeatures, showOnlyWithCoordinates])

  const parksWithCoordinates = useMemo(() => filteredParks.filter(hasCoordinates), [filteredParks])
  const selectedPark = filteredParks.find((park) => park.id === selectedId) || filteredParks[0] || parks[0]
  const selectedHref = selectedPark ? `/wake-parks/${selectedPark.citySlug}/${selectedPark.slug}` : '/wake-parks'
  const mapBounds = useMemo(() => createBounds(parksWithCoordinates), [parksWithCoordinates])
  const embedSrc = selectedPark ? createYandexEmbedUrl(selectedPark) : ''

  function toggleFeature(feature: string) {
    setSelectedFeatures((current) => (current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]))
  }

  function toggleCableType(type: string) {
    setSelectedCableTypes((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]))
  }

  function resetFilters() {
    setQuery('')
    setCitySlug('')
    setSelectedFeatures([])
    setSelectedCableTypes([])
    setShowOnlyWithCoordinates(false)
    setSelectedId(parks[0]?.id || '')
  }

  return (
    <section className="mt-10 grid gap-6 xl:grid-cols-[430px_1fr]">
      <aside className="rounded-3xl border border-border bg-card p-5 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-auto">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <label className="block">
            <span className="text-sm font-medium">Поиск</span>
            <input
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              onChange={(event) => {
                setQuery(event.target.value)
                setSelectedId('')
              }}
              placeholder="Название, адрес, услуга"
              value={query}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Город</span>
            <select
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              onChange={(event) => {
                setCitySlug(event.target.value)
                setSelectedId('')
              }}
              value={citySlug}
            >
              <option value="">Все города</option>
              {cities.map((city) => (
                <option key={city.id} value={city.slug}>
                  {city.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Тип катания</p>
            {selectedCableTypes.length ? <span className="text-xs text-muted-foreground">{selectedCableTypes.length} выбрано</span> : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {cableOptions.map(([type, label]) => {
              const active = selectedCableTypes.includes(type)
              return (
                <button
                  className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                    active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-secondary'
                  }`}
                  key={type}
                  onClick={() => toggleCableType(type)}
                  type="button"
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Услуги</p>
            {selectedFeatures.length ? <span className="text-xs text-muted-foreground">{selectedFeatures.length} выбрано</span> : null}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {featureOptions.map((feature) => {
              const active = selectedFeatures.includes(feature.key)
              return (
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition ${
                    active ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-secondary'
                  }`}
                  key={feature.key}
                >
                  <input checked={active} onChange={() => toggleFeature(feature.key)} type="checkbox" />
                  <span>{feature.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background p-4 text-sm">
          <input checked={showOnlyWithCoordinates} onChange={() => setShowOnlyWithCoordinates((value) => !value)} type="checkbox" />
          <span>Показывать только парки с координатами</span>
        </label>

        <div className="mt-5 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-secondary px-3 py-1">Всего: {parks.length}</span>
          <span className="rounded-full bg-secondary px-3 py-1">Найдено: {filteredParks.length}</span>
          <span className="rounded-full bg-secondary px-3 py-1">На карте: {parksWithCoordinates.length}</span>
        </div>

        <button className="mt-4 w-full rounded-full border border-border px-4 py-3 text-sm font-medium hover:bg-secondary" onClick={resetFilters} type="button">
          Сбросить фильтры
        </button>

        <div className="mt-5 grid gap-3">
          {filteredParks.length ? (
            filteredParks.map((park) => (
              <button
                className={`rounded-2xl border p-4 text-left transition hover:bg-secondary ${
                  selectedPark?.id === park.id ? 'border-primary bg-secondary' : 'border-border bg-background'
                }`}
                key={park.id}
                onClick={() => setSelectedId(park.id)}
                type="button"
              >
                <ParkListContent park={park} />
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
              По выбранным параметрам парков нет. Попробуй сменить город, очистить поиск или убрать часть услуг.
            </div>
          )}
        </div>
      </aside>

      <div className="grid gap-6">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Интерактивная карта</p>
              <h2 className="mt-1 text-2xl font-semibold">Маркеры парков</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1">координаты</span>
              <span className="rounded-full bg-secondary px-3 py-1">фильтры</span>
              <span className="rounded-full bg-secondary px-3 py-1">маршрут</span>
            </div>
          </div>

          <div className="relative min-h-[560px] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.18),transparent_30%),linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--background)))]">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:42px_42px]" />
            <div className="absolute left-5 top-5 z-10 rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm shadow-sm backdrop-blur">
              <p className="font-semibold">Карта-схема каталога</p>
              <p className="mt-1 text-xs text-muted-foreground">Без API-ключа: маркеры строятся по координатам из CMS.</p>
            </div>

            {parksWithCoordinates.length ? (
              parksWithCoordinates.map((park, index) => {
                const position = getMarkerPosition(park, mapBounds, index)
                const active = selectedPark?.id === park.id
                return (
                  <button
                    aria-label={`Выбрать ${park.title}`}
                    className={`absolute z-20 flex -translate-x-1/2 -translate-y-full items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold shadow-lg transition hover:scale-105 ${
                      active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-secondary'
                    }`}
                    key={park.id}
                    onClick={() => setSelectedId(park.id)}
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                    type="button"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-current/15">{index + 1}</span>
                    <span className="hidden max-w-[160px] truncate sm:inline">{park.title}</span>
                  </button>
                )
              })
            ) : (
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div className="max-w-md rounded-3xl border border-dashed border-border bg-background/90 p-6 text-muted-foreground backdrop-blur">
                  Для выбранных фильтров нет парков с координатами. Добавь широту и долготу в карточках парков или убери фильтр координат.
                </div>
              </div>
            )}

            {selectedPark ? (
              <div className="absolute bottom-5 left-5 right-5 z-30 rounded-3xl border border-border bg-background/95 p-5 shadow-xl backdrop-blur md:left-auto md:w-[420px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{selectedPark.cityTitle}</p>
                    <h3 className="mt-1 text-xl font-semibold">{selectedPark.title}</h3>
                  </div>
                  {selectedPark.rating ? <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">★ {selectedPark.rating}</span> : null}
                </div>
                {selectedPark.address && <p className="mt-3 text-sm text-muted-foreground">{selectedPark.address}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPark.cableTypes.slice(0, 2).map((type) => (
                    <span className="rounded-full border border-border px-2 py-1 text-xs" key={type}>
                      {cableTypeLabels[type] || type}
                    </span>
                  ))}
                  {selectedPark.features.slice(0, 3).map((feature) => (
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs" key={feature}>
                      {featureLabels[feature] || feature}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-lg font-semibold">{selectedPark.priceFrom ? `от ${selectedPark.priceFrom} ₽` : 'Цена уточняется'}</p>
                  <div className="flex flex-wrap gap-2">
                    <Link className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary" href={selectedHref}>
                      Подробнее
                    </Link>
                    {selectedPark.yandexMapsUrl ? (
                      <a className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href={selectedPark.yandexMapsUrl} rel="noreferrer" target="_blank">
                        Маршрут
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="border-b border-border p-5">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Яндекс.Карты</p>
              <h2 className="mt-1 text-2xl font-semibold">Карта выбранного парка</h2>
            </div>
            {embedSrc ? (
              <iframe
                className="h-[360px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={embedSrc}
                title={`Карта: ${selectedPark?.title}`}
              />
            ) : (
              <div className="grid h-[360px] place-items-center p-8 text-center text-muted-foreground">
                Для выбранного парка пока нет координат. Добавь широту и долготу в админке.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Как заполнить карту</p>
            <h2 className="mt-2 text-2xl font-semibold">Что нужно в админке</h2>
            <div className="mt-5 grid gap-3 text-sm text-muted-foreground">
              <p>1. В карточке парка заполни адрес, широту и долготу.</p>
              <p>2. Добавь ссылку на Яндекс.Карты — она используется для кнопки маршрута.</p>
              <p>3. Если координат нет, парк останется в списке, но не появится как маркер.</p>
              <p>4. Фильтры карты используют те же услуги и типы катания, что и каталог.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ParkListContent({ park }: { park: MapPark }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{park.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{park.cityTitle}</p>
        </div>
        {park.rating ? <span className="rounded-full bg-card px-2 py-1 text-xs font-medium">★ {park.rating}</span> : null}
      </div>
      {park.address && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{park.address}</p>}
      {!hasCoordinates(park) ? <p className="mt-2 text-xs text-amber-600 dark:text-amber-300">Нет координат для маркера</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {park.cableTypes.slice(0, 2).map((type) => (
          <span className="rounded-full border border-border px-2 py-1 text-xs" key={type}>
            {cableTypeLabels[type] || type}
          </span>
        ))}
        {park.features.slice(0, 2).map((feature) => (
          <span className="rounded-full bg-secondary px-2 py-1 text-xs" key={feature}>
            {featureLabels[feature] || feature}
          </span>
        ))}
      </div>
    </>
  )
}

function hasCoordinates(park: MapPark): park is MapPark & { lat: number; lng: number } {
  return typeof park.lat === 'number' && typeof park.lng === 'number' && Number.isFinite(park.lat) && Number.isFinite(park.lng)
}

function createBounds(parks: Array<MapPark & { lat: number; lng: number }>) {
  if (!parks.length) {
    return { minLat: 41, maxLat: 71, minLng: 19, maxLng: 180 }
  }

  const latitudes = parks.map((park) => park.lat)
  const longitudes = parks.map((park) => park.lng)
  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)
  const latPadding = Math.max((maxLat - minLat) * 0.15, 0.1)
  const lngPadding = Math.max((maxLng - minLng) * 0.15, 0.1)

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding,
  }
}

function getMarkerPosition(park: MapPark & { lat: number; lng: number }, bounds: ReturnType<typeof createBounds>, index: number) {
  const lngRange = bounds.maxLng - bounds.minLng || 1
  const latRange = bounds.maxLat - bounds.minLat || 1
  const jitterX = ((index % 3) - 1) * 1.4
  const jitterY = ((index % 2) - 0.5) * 1.4

  const x = ((park.lng - bounds.minLng) / lngRange) * 100 + jitterX
  const y = ((bounds.maxLat - park.lat) / latRange) * 100 + jitterY

  return {
    x: Math.min(94, Math.max(6, x)),
    y: Math.min(88, Math.max(12, y)),
  }
}

function createYandexEmbedUrl(park: MapPark): string {
  if (!hasCoordinates(park)) return ''

  const ll = `${park.lng},${park.lat}`
  const pt = `${park.lng},${park.lat},pm2rdm`
  return `https://yandex.ru/map-widget/v1/?ll=${encodeURIComponent(ll)}&pt=${encodeURIComponent(pt)}&z=13`
}
