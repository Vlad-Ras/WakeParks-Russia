'use client'

import Link from 'next/link'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { useMemo, useState } from 'react'

import { cableTypeLabels, featureLabels } from '../_wake/labels'

export type PickerCity = {
  id: string
  title: string
  slug?: string
}

export type PickerPark = {
  id: string
  title: string
  cityId?: string
  cityTitle?: string
  citySlug?: string
  parkSlug?: string
  href: string
  summary?: string
  address?: string
  imageUrl?: string | null
  imageAlt?: string
  priceFrom?: number | null
  rating?: number | null
  features: string[]
  cableTypes: string[]
  isVerified?: boolean
  isClaimed?: boolean
  isFeatured?: boolean
}

type Goal = 'beginner' | 'kids' | 'comfort' | 'sup' | 'sport' | 'budget'

type FormState = {
  cityId: string
  goal: Goal
  maxPrice: string
  requiredFeatures: string[]
  cableTypes: string[]
}

const goalLabels: Record<Goal, string> = {
  beginner: 'Я новичок, нужно обучение',
  kids: 'Еду с ребёнком',
  comfort: 'Важен комфорт и инфраструктура',
  sup: 'Хочу ещё SUP / пляжный отдых',
  sport: 'Нужны разные форматы катания',
  budget: 'Ищу бюджетный вариант',
}

const goalHints: Record<Goal, string> = {
  beginner: 'Сильнее учитываем обучение, аренду оборудования и понятную стартовую цену.',
  kids: 'Сильнее учитываем детскую школу, обучение, пляж и базовую инфраструктуру.',
  comfort: 'Сильнее учитываем кафе, душ, раздевалку, парковку и подтверждённые карточки.',
  sup: 'Сильнее учитываем SUP, пляж/зону отдыха и парки для спокойного отдыха.',
  sport: 'Сильнее учитываем типы катания, рейтинг и рекомендованные площадки.',
  budget: 'Сильнее учитываем цену и наличие базовых услуг без лишней инфраструктуры.',
}

const featureOptions = [
  'training',
  'equipmentRent',
  'kidsSchool',
  'supRent',
  'cafe',
  'shower',
  'changingRoom',
  'parking',
  'beach',
]

const cableOptions = ['ringCable', 'reverseCable', 'boatWake', 'winch']

export function ParkPickerClient({ cities, parks }: { cities: PickerCity[]; parks: PickerPark[] }) {
  const [form, setForm] = useState<FormState>({
    cityId: '',
    goal: 'beginner',
    maxPrice: '',
    requiredFeatures: [],
    cableTypes: [],
  })

  const results = useMemo(() => {
    return parks
      .map((park) => scorePark(park, form))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || (a.park.priceFrom || 999999) - (b.park.priceFrom || 999999))
      .slice(0, 12)
  }, [form, parks])

  const selectedGoalHint = goalHints[form.goal]

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
      <aside className="rounded-3xl border border-border bg-card p-5 lg:sticky lg:top-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Подбор</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Что тебе важно?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Подбор работает на данных каталога: город, цена, услуги, типы катания, рейтинг и бейджи доверия.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Город</span>
            <select
              className="min-h-11 rounded-2xl border border-border bg-background px-4"
              value={form.cityId}
              onChange={(event) => setForm((current) => ({ ...current, cityId: event.target.value }))}
            >
              <option value="">Любой город</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.title}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Цель поездки</span>
            <select
              className="min-h-11 rounded-2xl border border-border bg-background px-4"
              value={form.goal}
              onChange={(event) => setForm((current) => ({ ...current, goal: event.target.value as Goal }))}
            >
              {Object.entries(goalLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">{selectedGoalHint}</span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Максимальная цена “от”</span>
            <input
              className="min-h-11 rounded-2xl border border-border bg-background px-4"
              inputMode="numeric"
              min="0"
              placeholder="Например, 1000"
              type="number"
              value={form.maxPrice}
              onChange={(event) => setForm((current) => ({ ...current, maxPrice: event.target.value }))}
            />
          </label>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium">Обязательные услуги</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {featureOptions.map((feature) => (
                <label className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-sm" key={feature}>
                  <input
                    checked={form.requiredFeatures.includes(feature)}
                    type="checkbox"
                    onChange={() => toggleArrayValue(feature, 'requiredFeatures', setForm)}
                  />
                  <span>{featureLabels[feature] || feature}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium">Тип катания</legend>
            <div className="grid gap-2">
              {cableOptions.map((type) => (
                <label className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-sm" key={type}>
                  <input
                    checked={form.cableTypes.includes(type)}
                    type="checkbox"
                    onChange={() => toggleArrayValue(type, 'cableTypes', setForm)}
                  />
                  <span>{cableTypeLabels[type] || type}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            className="rounded-2xl border border-border px-4 py-3 text-sm font-medium hover:bg-secondary"
            type="button"
            onClick={() =>
              setForm({
                cityId: '',
                goal: 'beginner',
                maxPrice: '',
                requiredFeatures: [],
                cableTypes: [],
              })
            }
          >
            Сбросить подбор
          </button>
        </div>
      </aside>

      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Подходящие парки</h2>
            <p className="mt-2 text-muted-foreground">
              Найдено вариантов: {results.length}. Чем выше балл, тем лучше парк подходит под выбранные условия.
            </p>
          </div>
          <Link className="font-medium text-primary hover:underline" href="/wake-parks">
            Открыть весь каталог →
          </Link>
        </div>

        {results.length ? (
          <div className="grid gap-5">
            {results.map(({ park, score, reasons }) => (
              <article className="overflow-hidden rounded-3xl border border-border bg-card md:grid md:grid-cols-[260px_1fr]" key={park.id}>
                {park.imageUrl ? (
                  <Link className="block min-h-56 overflow-hidden bg-secondary" href={park.href}>
                    <img alt={park.imageAlt || park.title} className="h-full w-full object-cover" src={park.imageUrl} />
                  </Link>
                ) : (
                  <Link className="flex min-h-56 items-center justify-center bg-secondary text-sm text-muted-foreground" href={park.href}>
                    Фото пока нет
                  </Link>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Совпадение: {score}%
                    </span>
                    {park.isClaimed ? <Badge>Подтверждено владельцем</Badge> : null}
                    {park.isVerified ? <Badge>Проверен</Badge> : null}
                    {park.isFeatured ? <Badge>Рекомендуем</Badge> : null}
                    {park.rating ? <Badge>★ {park.rating}</Badge> : null}
                  </div>

                  <Link href={park.href}>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight hover:text-primary">{park.title}</h3>
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {park.cityTitle || 'Город не указан'}{park.address ? ` · ${park.address}` : ''}
                  </p>
                  {park.summary ? <p className="mt-4 line-clamp-3 text-muted-foreground">{park.summary}</p> : null}

                  {reasons.length ? (
                    <div className="mt-5">
                      <p className="text-sm font-medium">Почему подходит:</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {reasons.map((reason) => (
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs" key={reason}>
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
                    <div>
                      <p className="text-xs text-muted-foreground">Цена</p>
                      <p className="text-xl font-semibold">{park.priceFrom ? `от ${park.priceFrom} ₽` : 'уточняется'}</p>
                    </div>
                    <Link className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground" href={park.href}>
                      Подробнее
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <h3 className="text-2xl font-semibold">Ничего не подошло</h3>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Ослабь фильтры: убери обязательные услуги, увеличь максимальную цену или выбери любой город.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{children}</span>
}

function toggleArrayValue(
  value: string,
  field: 'requiredFeatures' | 'cableTypes',
  setForm: Dispatch<SetStateAction<FormState>>,
) {
  setForm((current) => {
    const exists = current[field].includes(value)
    return {
      ...current,
      [field]: exists ? current[field].filter((item) => item !== value) : [...current[field], value],
    }
  })
}

function scorePark(park: PickerPark, form: FormState) {
  let points = 20
  const reasons: string[] = []

  if (form.cityId) {
    if (park.cityId === form.cityId) {
      points += 18
      reasons.push('нужный город')
    } else {
      return { park, score: 0, reasons: [] }
    }
  }

  const maxPrice = Number(form.maxPrice)
  if (Number.isFinite(maxPrice) && maxPrice > 0) {
    if (park.priceFrom && park.priceFrom <= maxPrice) {
      points += 16
      reasons.push('проходит по цене')
    } else {
      points -= 25
    }
  }

  for (const feature of form.requiredFeatures) {
    if (park.features.includes(feature)) {
      points += 10
      reasons.push(featureLabels[feature] || feature)
    } else {
      points -= 18
    }
  }

  if (form.cableTypes.length) {
    const matches = form.cableTypes.filter((type) => park.cableTypes.includes(type))
    if (matches.length) {
      points += 10 + matches.length * 6
      matches.forEach((type) => reasons.push(cableTypeLabels[type] || type))
    } else {
      points -= 14
    }
  }

  switch (form.goal) {
    case 'beginner':
      points += hasFeature(park, 'training', reasons, 'есть обучение')
      points += hasFeature(park, 'equipmentRent', reasons, 'есть аренда')
      points += priceBonus(park, 1200, reasons)
      break
    case 'kids':
      points += hasFeature(park, 'kidsSchool', reasons, 'детская школа')
      points += hasFeature(park, 'training', reasons, 'инструктор')
      points += hasFeature(park, 'beach', reasons, 'зона отдыха')
      break
    case 'comfort':
      points += hasFeature(park, 'cafe', reasons, 'кафе')
      points += hasFeature(park, 'shower', reasons, 'душ')
      points += hasFeature(park, 'changingRoom', reasons, 'раздевалка')
      points += hasFeature(park, 'parking', reasons, 'парковка')
      break
    case 'sup':
      points += hasFeature(park, 'supRent', reasons, 'SUP')
      points += hasFeature(park, 'beach', reasons, 'пляж')
      break
    case 'sport':
      if (park.cableTypes.length >= 2) {
        points += 16
        reasons.push('несколько типов катания')
      }
      if ((park.rating || 0) >= 4.5) {
        points += 10
        reasons.push('высокий рейтинг')
      }
      break
    case 'budget':
      points += priceBonus(park, 900, reasons)
      break
  }

  if (park.isFeatured) points += 6
  if (park.isVerified) points += 6
  if (park.isClaimed) points += 8
  if (park.rating) points += Math.min(10, Math.max(0, park.rating * 2))

  const score = Math.max(0, Math.min(100, Math.round(points)))
  return { park, score, reasons: Array.from(new Set(reasons)).slice(0, 8) }
}

function hasFeature(park: PickerPark, feature: string, reasons: string[], reason: string) {
  if (!park.features.includes(feature)) return 0
  reasons.push(reason)
  return 12
}

function priceBonus(park: PickerPark, target: number, reasons: string[]) {
  if (!park.priceFrom) return 0
  if (park.priceFrom <= target) {
    reasons.push('хорошая цена для цели')
    return 10
  }
  return park.priceFrom <= target * 1.4 ? 3 : -6
}
