'use client'

import { useMemo, useState, type ChangeEvent } from 'react'

const sampleJson = {
  cities: [
    {
      title: 'Москва',
      slug: 'moscow',
      region: 'Москва и область',
      summary: 'Вейк-парки Москвы и ближайшего Подмосковья.',
      isPopular: true,
      sortOrder: 10,
    },
  ],
  parks: [
    {
      title: 'Тестовый Wake Park',
      slug: 'test-wake-park',
      citySlug: 'moscow',
      status: 'pending',
      summary: 'Тестовая карточка для проверки импорта. Замените описание на реальные данные.',
      address: 'Москва, примерный адрес',
      priceFrom: 700,
      rating: 4.7,
      cableTypes: ['reverseCable'],
      features: ['training', 'equipmentRent', 'parking'],
      phone: '+7 999 000-00-00',
      website: 'https://example.ru',
      yandexMapsUrl: 'https://yandex.ru/maps/',
      workTime: '10:00–22:00',
      season: 'Май–сентябрь',
    },
  ],
  prices: [
    {
      parkSlug: 'test-wake-park',
      title: '1 сет 10 минут',
      category: 'wake',
      price: 700,
      weekendPrice: 900,
      duration: '10 минут',
      status: 'pending',
    },
  ],
}

export function DataToolsClient() {
  const [token, setToken] = useState('')
  const [payloadText, setPayloadText] = useState(JSON.stringify(sampleJson, null, 2))
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const parsedInfo = useMemo(() => {
    try {
      const parsed = JSON.parse(payloadText)
      return {
        cities: Array.isArray(parsed.cities) ? parsed.cities.length : 0,
        parks: Array.isArray(parsed.parks) ? parsed.parks.length : 0,
        prices: Array.isArray(parsed.prices) ? parsed.prices.length : 0,
      }
    } catch {
      return null
    }
  }, [payloadText])

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    setPayloadText(await file.text())
  }

  async function runImport(mode: 'dryRun' | 'import') {
    setError('')
    setResult('')
    setIsSubmitting(true)

    try {
      const parsed = JSON.parse(payloadText)
      const response = await fetch('/actions/import-catalog', {
        body: JSON.stringify({ ...parsed, mode }),
        headers: {
          'Content-Type': 'application/json',
          'x-wake-admin-token': token,
        },
        method: 'POST',
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.error || 'Не удалось выполнить импорт.')
        return
      }

      setResult(JSON.stringify(data.summary || data, null, 2))
    } catch (e) {
      setError('Файл должен быть валидным JSON. CSV пока используется только для экспорта и ручной подготовки данных.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Импорт JSON</h2>
        <p className="mt-2 text-muted-foreground">
          Импорт защищён токеном. Добавь <code className="rounded bg-secondary px-1">WAKE_ADMIN_TOKEN</code> в .env и перезапусти сайт.
        </p>

        <label className="mt-5 block">
          <span className="text-sm font-medium">Токен импорта</span>
          <input
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            onChange={(event) => setToken(event.target.value)}
            placeholder="тот же токен, что в WAKE_ADMIN_TOKEN"
            type="password"
            value={token}
          />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-medium">Загрузить JSON-файл</span>
          <input className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3" onChange={handleFile} type="file" accept="application/json,.json" />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-medium">JSON для импорта</span>
          <textarea
            className="mt-2 min-h-[420px] w-full rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm outline-none focus:border-primary"
            onChange={(event) => setPayloadText(event.target.value)}
            value={payloadText}
          />
        </label>

        {parsedInfo ? (
          <p className="mt-3 text-sm text-muted-foreground">
            В файле: городов — {parsedInfo.cities}, парков — {parsedInfo.parks}, цен — {parsedInfo.prices}.
          </p>
        ) : (
          <p className="mt-3 text-sm text-red-600">JSON пока не читается. Проверь запятые, кавычки и скобки.</p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="rounded-full border border-border px-5 py-3 font-medium hover:bg-secondary disabled:opacity-60"
            disabled={isSubmitting}
            onClick={() => runImport('dryRun')}
            type="button"
          >
            Проверить без импорта
          </button>
          <button
            className="rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground disabled:opacity-60"
            disabled={isSubmitting}
            onClick={() => runImport('import')}
            type="button"
          >
            Импортировать
          </button>
        </div>

        {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">{error}</div>}
        {result && (
          <pre className="mt-5 overflow-auto rounded-2xl border border-border bg-background p-4 text-sm">{result}</pre>
        )}
      </section>

      <aside className="space-y-5">
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Экспорт</h2>
          <p className="mt-2 text-sm text-muted-foreground">Экспорт отдаёт опубликованные города, парки и цены. Это удобно для резервной копии и переноса данных.</p>
          <div className="mt-5 grid gap-3">
            <a className="rounded-full bg-primary px-5 py-3 text-center font-medium text-primary-foreground" href="/actions/export-catalog?format=json">
              Скачать JSON
            </a>
            <a className="rounded-full border border-border px-5 py-3 text-center font-medium hover:bg-secondary" href="/actions/export-catalog?format=csv">
              Скачать CSV
            </a>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Формат импорта</h2>
          <p className="mt-2 text-sm text-muted-foreground">Минимально нужны citySlug у парка, title и slug. Новые записи создаются, существующие обновляются по slug.</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Статус для новых парков лучше ставить <b>pending</b>.</li>
            <li>Фото через импорт пока не загружаются — их лучше добавлять в админке.</li>
            <li>CSV пока используется как экспорт и таблица для ручной подготовки данных.</li>
          </ul>
        </section>
      </aside>
    </div>
  )
}
