'use client'

import { useMemo, useState, type FormEvent } from 'react'

import type { CityDoc } from '../_wake/queries'

const featureGroups = [
  {
    title: 'Катание и обучение',
    options: [
      ['training', 'Обучение'],
      ['equipmentRent', 'Аренда оборудования'],
      ['kidsSchool', 'Детская школа'],
    ],
  },
  {
    title: 'Вода и активности',
    options: [
      ['supRent', 'SUP'],
      ['beach', 'Пляж / зона отдыха'],
    ],
  },
  {
    title: 'Инфраструктура',
    options: [
      ['cafe', 'Кафе'],
      ['shower', 'Душ'],
      ['changingRoom', 'Раздевалка'],
      ['parking', 'Парковка'],
    ],
  },
]

const flatFeatureOptions = featureGroups.flatMap((group) => group.options)

const cableOptions = [
  ['ringCable', 'Кольцевая канатка'],
  ['reverseCable', 'Реверсивная канатка'],
  ['boatWake', 'Катерный вейк'],
  ['winch', 'Лебёдка'],
]

const priceCategoryOptions = [
  ['wake', 'Вейкборд / сеты'],
  ['training', 'Обучение'],
  ['rent', 'Аренда оборудования'],
  ['sup', 'SUP и вода'],
  ['package', 'Абонементы / пакеты'],
  ['other', 'Прочее'],
]

type PriceDraft = {
  id: string
  title: string
  category: string
  price: string
  weekdayPrice: string
  weekendPrice: string
  duration: string
  description: string
}

function createPriceDraft(): PriceDraft {
  return {
    id: Math.random().toString(36).slice(2),
    title: '',
    category: 'wake',
    price: '',
    weekdayPrice: '',
    weekendPrice: '',
    duration: '',
    description: '',
  }
}

export function AddParkForm({ cities }: { cities: CityDoc[] }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [prices, setPrices] = useState<PriceDraft[]>([createPriceDraft()])
  const [photoUrls, setPhotoUrls] = useState<string[]>([''])

  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'ru')),
    [cities],
  )

  function updatePrice(id: string, field: keyof PriceDraft, value: string) {
    setPrices((current) => current.map((price) => (price.id === id ? { ...price, [field]: value } : price)))
  }

  function removePrice(id: string) {
    setPrices((current) => (current.length > 1 ? current.filter((price) => price.id !== id) : current))
  }

  function updatePhotoUrl(index: number, value: string) {
    setPhotoUrls((current) => current.map((url, currentIndex) => (currentIndex === index ? value : url)))
  }

  function removePhotoUrl(index: number) {
    setPhotoUrls((current) => (current.length > 1 ? current.filter((_, currentIndex) => currentIndex !== index) : current))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    const features = Object.fromEntries(flatFeatureOptions.map(([key]) => [key, formData.getAll('features').includes(key)]))
    const preparedPrices = prices
      .map((price) => ({
        title: price.title.trim(),
        category: price.category,
        description: price.description.trim(),
        price: price.price.trim(),
        weekdayPrice: price.weekdayPrice.trim(),
        weekendPrice: price.weekendPrice.trim(),
        duration: price.duration.trim(),
      }))
      .filter((price) => price.title || price.price || price.weekdayPrice || price.weekendPrice)

    const payload = {
      title: formData.get('title'),
      cityId: formData.get('cityId'),
      summary: formData.get('summary'),
      description: formData.get('description'),
      address: formData.get('address'),
      district: formData.get('district'),
      yandexMapsUrl: formData.get('yandexMapsUrl'),
      workTime: formData.get('workTime'),
      season: formData.get('season'),
      phone: formData.get('phone'),
      website: formData.get('website'),
      vk: formData.get('vk'),
      telegram: formData.get('telegram'),
      priceFrom: formData.get('priceFrom'),
      submitterName: formData.get('submitterName'),
      submitterPhone: formData.get('submitterPhone'),
      submitterEmail: formData.get('submitterEmail'),
      comment: formData.get('comment'),
      company: formData.get('company'),
      features,
      cableTypes: formData.getAll('cableTypes'),
      prices: preparedPrices,
      photoUrls: photoUrls.map((url) => url.trim()).filter(Boolean),
    }

    try {
      const response = await fetch('/actions/add-park', {
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(result.error || 'Не удалось отправить парк.')
        return
      }

      form.reset()
      setPrices([createPriceDraft()])
      setPhotoUrls([''])
      setSuccess(true)
    } catch {
      setError('Не удалось отправить парк. Проверь, что сайт запущен, и попробуй ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="rounded-3xl border border-border bg-card p-5 md:p-8" onSubmit={handleSubmit}>
      {success && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          Парк отправлен на модерацию. Он появится в каталоге только после проверки в админке.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          {error}
        </div>
      )}

      <SectionTitle title="Основная информация" description="Эти данные попадут в карточку парка после модерации." />
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Название парка" name="title" placeholder="Например: Wake Park Волна" required />

        <label className="block">
          <span className="text-sm font-medium">Город *</span>
          <select className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" name="cityId" required>
            <option value="">Выбери город</option>
            {sortedCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.title} {city.region ? `— ${city.region}` : ''}
              </option>
            ))}
          </select>
          {!sortedCities.length && (
            <span className="mt-2 block text-xs text-muted-foreground">Сначала добавь город через админку.</span>
          )}
        </label>
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-medium">Краткое описание *</span>
        <textarea
          className="mt-2 min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          name="summary"
          placeholder="Что есть в парке: канатка, обучение, аренда, пляж, кафе, SUP..."
          required
        />
      </label>

      <label className="mt-5 block">
        <span className="text-sm font-medium">Полное описание</span>
        <textarea
          className="mt-2 min-h-32 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          name="description"
          placeholder="Более подробное описание: кому подходит, что рядом, особенности локации, безопасность, инструкторы..."
        />
      </label>

      <div className="mt-8 border-t border-border pt-6">
        <SectionTitle title="Локация и контакты" />
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Адрес" name="address" placeholder="Город, улица, ориентир" />
          <Field label="Район / ориентир" name="district" placeholder="Парк, озеро, пляж, район города" />
          <Field label="Ссылка на Яндекс.Карты" name="yandexMapsUrl" placeholder="https://yandex.ru/maps/..." />
          <Field label="Цена от, ₽" name="priceFrom" placeholder="700" type="number" />
          <Field label="График работы" name="workTime" placeholder="Ежедневно 10:00–22:00" />
          <Field label="Сезон" name="season" placeholder="Май–сентябрь / круглый год" />
          <Field label="Телефон парка" name="phone" placeholder="+7..." />
          <Field label="Сайт парка" name="website" placeholder="wakepark.ru" />
          <Field label="VK" name="vk" placeholder="vk.com/..." />
          <Field label="Telegram" name="telegram" placeholder="@wakepark или ссылка" />
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <SectionTitle title="Услуги" description="Услуги сгруппированы так же, как они показываются в карточке парка." />
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {featureGroups.map((group) => (
            <fieldset className="rounded-3xl border border-border p-4" key={group.title}>
              <legend className="px-2 text-sm font-medium">{group.title}</legend>
              <div className="mt-2 grid gap-2">
                {group.options.map(([key, label]) => (
                  <label className="flex items-center gap-3 rounded-2xl border border-border px-3 py-2 text-sm" key={key}>
                    <input name="features" type="checkbox" value={key} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <SectionTitle title="Тип катания" />
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {cableOptions.map(([key, label]) => (
            <label className="flex items-center gap-3 rounded-2xl border border-border px-3 py-2 text-sm" key={key}>
              <input name="cableTypes" type="checkbox" value={key} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <SectionTitle title="Цены" description="Можно добавить несколько строк прайса. Они уйдут на модерацию вместе с парком." />
        <div className="mt-5 grid gap-4">
          {prices.map((price, index) => (
            <div className="rounded-3xl border border-border p-4" key={price.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium">Позиция прайса #{index + 1}</p>
                {prices.length > 1 && (
                  <button className="text-sm text-muted-foreground hover:text-destructive" type="button" onClick={() => removePrice(price.id)}>
                    Удалить
                  </button>
                )}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input value={price.title} label="Услуга" placeholder="1 сет 10 минут" onChange={(value) => updatePrice(price.id, 'title', value)} />
                <label className="block">
                  <span className="text-sm font-medium">Категория</span>
                  <select className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" value={price.category} onChange={(event) => updatePrice(price.id, 'category', event.target.value)}>
                    {priceCategoryOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <Input value={price.price} label="Основная цена, ₽" placeholder="700" type="number" onChange={(value) => updatePrice(price.id, 'price', value)} />
                <Input value={price.duration} label="Длительность" placeholder="10 минут" onChange={(value) => updatePrice(price.id, 'duration', value)} />
                <Input value={price.weekdayPrice} label="Цена в будни, ₽" placeholder="600" type="number" onChange={(value) => updatePrice(price.id, 'weekdayPrice', value)} />
                <Input value={price.weekendPrice} label="Цена в выходные, ₽" placeholder="800" type="number" onChange={(value) => updatePrice(price.id, 'weekendPrice', value)} />
              </div>
              <label className="mt-4 block">
                <span className="text-sm font-medium">Описание цены</span>
                <textarea
                  className="mt-2 min-h-20 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                  value={price.description}
                  placeholder="Что входит в услугу, ограничения, условия..."
                  onChange={(event) => updatePrice(price.id, 'description', event.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
        <button className="mt-4 rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-secondary" type="button" onClick={() => setPrices((current) => [...current, createPriceDraft()])}>
          + Добавить ещё цену
        </button>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <SectionTitle title="Фото" description="Пока публичная форма принимает ссылки на фото. После модерации администратор может загрузить изображения в медиа и назначить их карточке." />
        <div className="mt-5 grid gap-3">
          {photoUrls.map((url, index) => (
            <div className="flex gap-2" key={index}>
              <input
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="https://.../photo.jpg"
                value={url}
                onChange={(event) => updatePhotoUrl(index, event.target.value)}
              />
              {photoUrls.length > 1 && (
                <button className="rounded-2xl border border-border px-4 text-sm hover:bg-secondary" type="button" onClick={() => removePhotoUrl(index)}>
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-secondary" type="button" onClick={() => setPhotoUrls((current) => [...current, ''])}>
          + Добавить ссылку на фото
        </button>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <SectionTitle title="Кто отправляет заявку" />
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Field label="Имя" name="submitterName" placeholder="Иван" />
          <Field label="Телефон" name="submitterPhone" placeholder="+7..." />
          <Field label="Email" name="submitterEmail" placeholder="mail@example.ru" type="email" />
        </div>
        <label className="mt-5 block">
          <span className="text-sm font-medium">Комментарий</span>
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            name="comment"
            placeholder="Что ещё важно указать: источник данных, ссылки на актуальный прайс, примечания для модератора..."
          />
        </label>
      </div>

      <input autoComplete="off" className="hidden" name="company" tabIndex={-1} type="text" />

      <p className="mt-5 text-xs text-muted-foreground">
        Отправка формы создаёт парк и строки прайса со статусом «На модерации». На сайте они появятся только после проверки администратором.
      </p>

      <button className="mt-6 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Отправляем...' : 'Отправить на модерацию'}
      </button>
    </form>
  )
}

function SectionTitle({ description, title }: { description?: string; title: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

function Field({ label, name, placeholder, required, type = 'text' }: { label: string; name: string; placeholder?: string; required?: boolean; type?: string }) {
  return (
    <label className="block">
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

function Input({ label, onChange, placeholder, type = 'text', value }: { label: string; onChange: (value: string) => void; placeholder?: string; type?: string; value: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
