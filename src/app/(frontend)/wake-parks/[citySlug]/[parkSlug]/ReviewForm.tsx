'use client'

import { useState, type FormEvent } from 'react'

export function ReviewForm({ parkId }: { parkId: string | number }) {
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
      const response = await fetch('/actions/add-review', {
        body: JSON.stringify({
          parkId,
          authorName: formData.get('authorName'),
          rating: formData.get('rating'),
          text: formData.get('text'),
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
        setError(result.error || 'Не удалось отправить отзыв.')
        return
      }

      form.reset()
      setSuccess(true)
    } catch {
      setError('Не удалось отправить отзыв. Проверь, что сайт запущен, и попробуй ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="mt-5 rounded-3xl border border-border bg-background p-5" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold">Оставить отзыв</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Отзыв попадёт на модерацию и появится на сайте только после проверки администратором.
      </p>

      {success && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          Спасибо, отзыв отправлен на модерацию.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_160px]">
        <Field label="Имя" name="authorName" placeholder="Иван" required />
        <label className="block">
          <span className="text-sm font-medium">Оценка *</span>
          <select className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" name="rating" required defaultValue="5">
            <option value="5">5 — отлично</option>
            <option value="4">4 — хорошо</option>
            <option value="3">3 — нормально</option>
            <option value="2">2 — плохо</option>
            <option value="1">1 — ужасно</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Текст отзыва *</span>
        <textarea
          className="mt-2 min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          name="text"
          placeholder="Что понравилось, какие цены, как с обучением, есть ли аренда, удобно ли добираться..."
          required
        />
      </label>

      <Field label="Email для связи с модератором" name="contactEmail" placeholder="mail@example.ru" type="email" />
      <input autoComplete="off" className="hidden" name="company" tabIndex={-1} type="text" />

      <button className="mt-5 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Отправляем...' : 'Отправить отзыв'}
      </button>
    </form>
  )
}

function Field({ label, name, placeholder, required, type = 'text' }: { label: string; name: string; placeholder?: string; required?: boolean; type?: string }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium">
        {label} {required ? '*' : ''}
      </span>
      <input
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  )
}
