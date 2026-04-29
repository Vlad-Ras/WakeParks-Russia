'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type MapPark = {
  id: string
  title: string
  slug: string
  cityTitle: string
  citySlug: string
  priceFrom?: number
  rating?: number
  address?: string
  lat?: number
  lng?: number
}

type YandexMapProps = {
  apiKey: string
  defaultCenter?: {
    lat?: number
    lng?: number
  }
  defaultZoom?: number
  onSelect: (parkId: string) => void
  parks: Array<MapPark & { lat: number; lng: number }>
  selectedParkId?: string
}

declare global {
  interface Window {
    ymaps?: any
    __wakeYandexMapsLoading?: Promise<void>
  }
}

export function YandexMap({ apiKey, defaultCenter, defaultZoom = 5, onSelect, parks, selectedParkId }: YandexMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const center = useMemo(() => {
    const firstPark = parks[0]
    return [defaultCenter?.lat ?? firstPark?.lat ?? 55.751244, defaultCenter?.lng ?? firstPark?.lng ?? 37.618423] as [number, number]
  }, [defaultCenter?.lat, defaultCenter?.lng, parks])

  useEffect(() => {
    let cancelled = false

    async function initMap() {
      if (!apiKey) {
        setError('В настройках карт не указан API-ключ Яндекс.Карт.')
        setIsLoading(false)
        return
      }

      if (!containerRef.current) return

      try {
        setIsLoading(true)
        setError('')
        await loadYandexMaps(apiKey)
        await window.ymaps.ready()

        if (cancelled || !containerRef.current) return

        if (mapRef.current) {
          mapRef.current.destroy()
          mapRef.current = null
        }

        const map = new window.ymaps.Map(containerRef.current, {
          center,
          controls: ['zoomControl', 'fullscreenControl'],
          zoom: defaultZoom,
        })

        mapRef.current = map

        const geoObjects: any[] = []

        parks.forEach((park) => {
          const isSelected = park.id === selectedParkId
          const placemark = new window.ymaps.Placemark(
            [park.lat, park.lng],
            {
              balloonContentHeader: escapeHtml(park.title),
              balloonContentBody: [
                park.cityTitle ? `<div>${escapeHtml(park.cityTitle)}</div>` : '',
                park.address ? `<div>${escapeHtml(park.address)}</div>` : '',
                park.priceFrom ? `<div><b>от ${park.priceFrom} ₽</b></div>` : '',
              ]
                .filter(Boolean)
                .join(''),
              hintContent: escapeHtml(park.title),
            },
            {
              preset: isSelected ? 'islands#redIcon' : 'islands#blueIcon',
            },
          )

          placemark.events.add('click', () => onSelect(park.id))
          map.geoObjects.add(placemark)
          geoObjects.push(placemark)
        })

        if (geoObjects.length > 1) {
          map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 48,
          })
        } else if (geoObjects.length === 1) {
          map.setCenter([parks[0].lat, parks[0].lng], Math.max(defaultZoom, 12))
        }
      } catch (caughtError) {
        console.error(caughtError)
        setError('Не удалось загрузить Яндекс.Карту. Проверь API-ключ, ограничения ключа и доступ к api-maps.yandex.ru.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    initMap()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [apiKey, center, defaultZoom, onSelect, parks, selectedParkId])

  return (
    <div className="relative min-h-[560px] overflow-hidden bg-secondary">
      <div className="h-[560px] w-full" ref={containerRef} />
      {isLoading ? <div className="absolute inset-0 grid place-items-center bg-background/80 text-sm text-muted-foreground backdrop-blur">Загружаем Яндекс.Карту…</div> : null}
      {error ? (
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-destructive/30 bg-background/95 p-4 text-sm text-destructive shadow-lg backdrop-blur md:right-auto md:max-w-xl">
          {error}
        </div>
      ) : null}
    </div>
  )
}

function loadYandexMaps(apiKey: string) {
  if (window.ymaps) return Promise.resolve()
  if (window.__wakeYandexMapsLoading) return window.__wakeYandexMapsLoading

  window.__wakeYandexMapsLoading = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-wake-yandex-maps="true"]')

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () => reject(new Error('Yandex Maps script failed to load')))
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.dataset.wakeYandexMaps = 'true'
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Yandex Maps script failed to load'))
    document.head.appendChild(script)
  })

  return window.__wakeYandexMapsLoading
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
