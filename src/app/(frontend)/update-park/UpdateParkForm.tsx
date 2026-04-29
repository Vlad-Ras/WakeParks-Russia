'use client'

import { useMemo, useState, type FormEvent } from 'react'

type ParkOption = {
  id: string
  title: string
  cityTitle?: string
  href?: string
}

const reportTypes = [
  ['price', 'Цены'],
  ['contacts', 'Контакты'],
  ['location', 'Адрес / карта'],
  ['schedule', 'График работы'],
  ['features', 'Услуги / инфраструктура'],
  ['closed', 'Парк закрыт'],
  ['duplicate', 'Дубль карточки'],
  ['other', 'Другое'],
]

export function UpdateParkForm({ parks, selectedParkId }: { parks: ParkOption[]; selectedParkId?: string }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredParks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return parks.slice(0, 80)
    return parks
      .filter((park) => `${park.title} ${park.cityTitle || ''}`.toLowerCase().includes(q))
      .slice(0, 80)
  }, [parks, query])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    const message = [
      `Что обновить: ${formData.get('type') || 'other'}`,
      `Новые данные:\n${formData.get('message') || ''}`,
      formData.get('oldValue') ? `Сейчас указано:\n${formData.get('oldValue')}` : '',
    ]
      .filter(Boolean)
      .join('\n\n')

    try {
      const response = await fetch('/actions/report-park', {
        body: JSON.stringify({
          parkId: formData.get('parkId'),
          type: formData.get('type'),
          message,
          sourceUrl: formData.get('sourceUrl'),
          authorName: formData.get('authorName'),
          contactEmail: formData.get('contactEmail'),
          company: formData.get('company'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(result.error || 'Не удалось отправить обновление.')
        return
      }

      form.reset()
      setQuery('')
      setSuccess(true)
    } catch {
      setError('Не удалось отправить обновление. Проверь, что сайт запущен, и попробуй ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="rounded-3xl border border-border bg-card p-5 md:p-6" onSubmit={handleSubmit}>
      {success && (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          Спасибо, обновление отправлено на модерацию.
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          {error}
        </div>
      )}

      <label className="block">
        <span className="text-sm font-medium">Быстрый поиск парка</span>
        <input
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Название парка или город"
          value={query}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Парк *</span>
        <select
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          defaultValue={selectedParkId || ''}
          name="parkId"
          required
        >
          <option value="">Выбери парк</option>
          {filteredParks.map((park) => (
            <option key={park.id} value={park.id}>
              {park.title}{park.cityTitle ? ` — ${park.cityTitle}` : ''}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Что обновить *</span>
        <select className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" defaultValue="other" name="type" required>
          {reportTypes.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Что сейчас указано</span>
        <textarea
          className="mt-2 min-h-24 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          name="oldValue"
          placeholder="Например: цена 700 ₽ или старый график 10:00–20:00"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Новые данные *</span>
        <textarea
          className="mt-2 min-h-36 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          name="message"
          placeholder="Например: 1 сет 10 минут теперь 900 ₽, график 09:00–22:00, новая ссылка VK..."
          required
        />
      </label>

      <Field label="Источник" name="sourceUrl" placeholder="Сайт, VK, Яндекс.Карты, 2ГИС или пост с подтверждением" />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Имя" name="authorName" placeholder="Иван" />
        <Field label="Email" name="contactEmail" placeholder="mail@example.ru" type="email" />
      </div>

      <input autoComplete="off" className="hidden" name="company" tabIndex={-1} type="text" />

      <button className="mt-5 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Отправляем...' : 'Отправить обновление'}
      </button>
    </form>
  )
}

function Field({ label, name, placeholder, type = 'text' }: { label: string; name: string; placeholder?: string; type?: string }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </label>
  )
}
