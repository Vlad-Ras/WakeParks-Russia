'use client'

import { useMemo, useState, type FormEvent } from 'react'

import type { ParkDoc } from '../_wake/queries'

const claimTypes = [
  ['owner', 'Я владелец парка'],
  ['manager', 'Я управляющий / администратор'],
  ['representative', 'Официальный представитель'],
  ['updateAccess', 'Хочу обновлять карточку'],
  ['partnership', 'Партнёрство / продвижение'],
  ['other', 'Другое'],
]

const contactOptions = [
  ['telegram', 'Telegram'],
  ['phone', 'Телефон'],
  ['email', 'Email'],
]

const actionOptions = [
  ['claimCard', 'Подтвердить карточку владельцем'],
  ['updateContacts', 'Обновить контакты'],
  ['updatePrices', 'Обновить цены'],
  ['updatePhotos', 'Добавить / заменить фото'],
  ['updateSchedule', 'Обновить график и сезон'],
  ['addPromotion', 'Обсудить продвижение'],
]

export function ClaimParkForm({ initialParkId, parks }: { initialParkId?: string; parks: ParkDoc[] }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sortedParks = useMemo(
    () =>
      [...parks].sort((a, b) => {
        const aCity = getCityTitle(a)
        const bCity = getCityTitle(b)
        return `${aCity} ${a.title || ''}`.localeCompare(`${bCity} ${b.title || ''}`, 'ru')
      }),
    [parks],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/actions/claim-park', {
        body: JSON.stringify({
          parkId: formData.get('parkId'),
          claimType: formData.get('claimType'),
          requestedActions: formData.getAll('requestedActions'),
          contactName: formData.get('contactName'),
          companyName: formData.get('companyName'),
          role: formData.get('role'),
          phone: formData.get('phone'),
          telegram: formData.get('telegram'),
          email: formData.get('email'),
          preferredContact: formData.get('preferredContact'),
          proofUrl: formData.get('proofUrl'),
          proofUrl2: formData.get('proofUrl2'),
          message: formData.get('message'),
          consent: formData.get('consent'),
          company: formData.get('company'),
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(result.error || 'Не удалось отправить заявку.')
        return
      }

      form.reset()
      setSuccess(true)
      window.location.href = `/claim-success?park=${encodeURIComponent(String(formData.get('parkId') || ''))}`
    } catch {
      setError('Не удалось отправить заявку. Проверь, что сайт запущен, и попробуй ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="rounded-3xl border border-border bg-card p-5 md:p-8" onSubmit={handleSubmit}>
      {success && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          Заявка отправлена. Сейчас откроется страница с дальнейшими шагами.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Парк *</span>
          <select className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" defaultValue={initialParkId || ''} name="parkId" required>
            <option value="">Выбери парк из каталога</option>
            {sortedParks.map((park) => {
              const cityTitle = getCityTitle(park)
              return (
                <option key={park.id} value={park.id}>
                  {park.title} {cityTitle ? `— ${cityTitle}` : ''}
                </option>
              )
            })}
          </select>
          {!sortedParks.length && <span className="mt-2 block text-xs text-muted-foreground">Пока нет опубликованных парков. Сначала добавь парк в каталог.</span>}
        </label>

        <label className="block">
          <span className="text-sm font-medium">Тип заявки</span>
          <select className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" defaultValue="owner" name="claimType">
            {claimTypes.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Предпочтительный способ связи</span>
          <select className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" defaultValue="telegram" name="preferredContact">
            {contactOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <fieldset className="rounded-3xl border border-border bg-background p-4 md:col-span-2">
          <legend className="px-2 text-sm font-medium">Что нужно сделать с карточкой</legend>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {actionOptions.map(([value, label]) => (
              <label className="flex items-start gap-3 rounded-2xl bg-card p-3 text-sm" key={value}>
                <input className="mt-1" defaultChecked={value === 'claimCard'} name="requestedActions" type="checkbox" value={value} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Контактное лицо" name="contactName" placeholder="Иван Иванов" required />
        <Field label="Компания / юрлицо" name="companyName" placeholder="ООО «Вейк парк» / ИП..." />
        <Field label="Роль в парке" name="role" placeholder="Владелец, управляющий, администратор..." />
        <Field label="Телефон" name="phone" placeholder="+7..." />
        <Field label="Telegram" name="telegram" placeholder="@username или ссылка" />
        <Field label="Email" name="email" placeholder="mail@example.ru" type="email" />

        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Подтверждающая ссылка *</span>
          <input className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" name="proofUrl" placeholder="Официальный сайт, VK, Яндекс.Карты, 2ГИС или публикация" required />
          <span className="mt-2 block text-xs text-muted-foreground">Лучше всего подходит ссылка, где видно связь заявителя или контактов с парком.</span>
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Дополнительная ссылка</span>
          <input className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" name="proofUrl2" placeholder="Вторая ссылка: соцсеть, прайс, пост, сайт, карточка в картах" />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Комментарий</span>
          <textarea className="mt-2 min-h-32 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" name="message" placeholder="Что нужно обновить или подтвердить?" />
        </label>
      </div>

      <input autoComplete="off" className="hidden" name="company" tabIndex={-1} type="text" />

      <label className="mt-5 flex items-start gap-3 rounded-2xl bg-secondary/70 p-4 text-sm text-muted-foreground">
        <input className="mt-1" name="consent" required type="checkbox" value="yes" />
        <span>Я согласен на обработку персональных данных для рассмотрения заявки. Доступ к карточке не выдаётся автоматически: заявка проверяется вручную.</span>
      </label>

      <button className="mt-6 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
      </button>
    </form>
  )
}

function Field({ label, name, placeholder, required, type = 'text' }: { label: string; name: string; placeholder?: string; required?: boolean; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label} {required ? '*' : ''}</span>
      <input className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" name={name} placeholder={placeholder} required={required} type={type} />
    </label>
  )
}

function getCityTitle(park: ParkDoc) {
  if (!park.city || typeof park.city === 'string' || typeof park.city === 'number') return ''
  return park.city.title || ''
}
