'use client'

import { useState, type FormEvent } from 'react'

const reportTypes = [
  ['price', 'Цена'],
  ['contacts', 'Контакты'],
  ['location', 'Адрес / карта'],
  ['schedule', 'График работы'],
  ['features', 'Услуги / инфраструктура'],
  ['closed', 'Парк закрыт'],
  ['duplicate', 'Дубль карточки'],
  ['other', 'Другое'],
]

export function ReportIssueForm({ parkId }: { parkId: string | number }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/actions/report-park', {
        body: JSON.stringify({
          parkId,
          type: formData.get('type'),
          message: formData.get('message'),
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
        setError(result.error || 'Не удалось отправить правку.')
        return
      }

      form.reset()
      setSuccess(true)
    } catch {
      setError('Не удалось отправить правку. Проверь, что сайт запущен, и попробуй ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="mt-5 rounded-3xl border border-border bg-background p-5" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold">Сообщить об ошибке</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Если цена, график, адрес или контакты устарели, отправь правку. Она попадёт в админку на проверку.
      </p>

      {success && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          Спасибо, правка отправлена на модерацию.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          {error}
        </div>
      )}

      <label className="mt-4 block">
        <span className="text-sm font-medium">Что исправить</span>
        <select className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" defaultValue="other" name="type">
          {reportTypes.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Описание правки *</span>
        <textarea
          className="mt-2 min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          name="message"
          placeholder="Например: цена сета теперь 900 ₽, график изменился на 10:00–22:00, Telegram указан неверно..."
          required
        />
      </label>

      <Field label="Источник" name="sourceUrl" placeholder="Ссылка на сайт, VK, Яндекс.Карты или пост с актуальной информацией" />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Имя" name="authorName" placeholder="Иван" />
        <Field label="Email" name="contactEmail" placeholder="mail@example.ru" type="email" />
      </div>

      <input autoComplete="off" className="hidden" name="company" tabIndex={-1} type="text" />

      <button className="mt-5 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Отправляем...' : 'Отправить правку'}
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
