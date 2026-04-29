'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'

type SubmitState = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setState('sending')
    setMessage('')

    const body = {
      requestType: String(formData.get('requestType') || 'general'),
      name: String(formData.get('name') || ''),
      subject: String(formData.get('subject') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      telegram: String(formData.get('telegram') || ''),
      message: String(formData.get('message') || ''),
      company: String(formData.get('company') || ''),
      sourcePage: typeof window !== 'undefined' ? window.location.href : '',
      privacyAccepted: formData.get('privacyAccepted') === 'on',
    }

    try {
      const response = await fetch('/actions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json?.error || 'Не удалось отправить обращение.')
      }

      setState('success')
      setMessage('Обращение отправлено. Оно появится в админке в разделе “Обратная связь → Обращения”.')
      form.reset()
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'Не удалось отправить обращение.')
    }
  }

  return (
    <form className="rounded-3xl border border-border bg-card p-5 md:p-7" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Тип обращения
          <select className="min-h-12 rounded-2xl border border-border bg-background px-4" name="requestType">
            <option value="general">Общий вопрос</option>
            <option value="partnership">Партнёрство</option>
            <option value="park">Вопрос по парку</option>
            <option value="ads">Реклама / продвижение</option>
            <option value="bug">Ошибка на сайте</option>
            <option value="legal">Юридический вопрос</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Тема
          <input className="min-h-12 rounded-2xl border border-border bg-background px-4" name="subject" placeholder="Например: обновить данные парка" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Имя
          <input className="min-h-12 rounded-2xl border border-border bg-background px-4" name="name" required />
        </label>
        <label className="hidden">
          Компания
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input className="min-h-12 rounded-2xl border border-border bg-background px-4" name="email" type="email" placeholder="mail@example.ru" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Телефон
          <input className="min-h-12 rounded-2xl border border-border bg-background px-4" name="phone" placeholder="+7..." />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Telegram
          <input className="min-h-12 rounded-2xl border border-border bg-background px-4" name="telegram" placeholder="@username" />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-medium">
        Сообщение
        <textarea className="min-h-36 rounded-2xl border border-border bg-background px-4 py-3" name="message" placeholder="Опиши вопрос, предложение или проблему" required />
      </label>

      <label className="mt-5 flex gap-3 text-sm text-muted-foreground">
        <input className="mt-1" name="privacyAccepted" type="checkbox" required />
        <span>
          Я согласен на обработку персональных данных и понимаю, что данные используются только для ответа на обращение.
        </span>
      </label>

      <button className="mt-5 rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-60" disabled={state === 'sending'} type="submit">
        {state === 'sending' ? 'Отправляем...' : 'Отправить обращение'}
      </button>

      {message ? (
        <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${state === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'border-destructive/30 bg-destructive/10 text-destructive'}`}>
          {message}
        </p>
      ) : null}
    </form>
  )
}
