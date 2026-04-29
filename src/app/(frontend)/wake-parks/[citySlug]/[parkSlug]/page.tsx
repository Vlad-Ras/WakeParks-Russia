import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '../../../_wake/Breadcrumbs'
import { cableTypeLabels, featureLabels, getGroupedActiveFeatures } from '../../../_wake/labels'
import { FavoriteButton } from '../../../_wake/FavoriteButton'
import { CompareButton } from '../../../_wake/CompareButton'
import { getImageAlt, getImageUrl, getObjectPosition } from '../../../_wake/media'
import {
  getCities,
  getCityBySlug,
  getParkBySlug,
  getParksByCity,
  getPricesByPark,
  getReviewsByPark,
  type PriceDoc,
} from '../../../_wake/queries'
import { ReportIssueForm } from './ReportIssueForm'
import { ReviewForm } from './ReviewForm'

export async function generateStaticParams() {
  const cities = await getCities()
  const params: Array<{ citySlug: string; parkSlug: string }> = []

  for (const city of cities) {
    if (!city.slug) continue
    const parks = await getParksByCity(city.id)
    parks.forEach((park) => {
      if (park.slug) params.push({ citySlug: city.slug as string, parkSlug: park.slug })
    })
  }

  return params
}

type Args = {
  params: Promise<{
    citySlug: string
    parkSlug: string
  }>
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { citySlug, parkSlug } = await paramsPromise
  const city = await getCityBySlug(decodeURIComponent(citySlug))
  if (!city) return { title: 'Парк не найден — Wake Parks Russia' }

  const park = await getParkBySlug(city.id, decodeURIComponent(parkSlug))
  if (!park) return { title: 'Парк не найден — Wake Parks Russia' }

  return {
    title: park.meta?.title || `${park.title} — вейк-парк ${city.title}`,
    description:
      park.meta?.description ||
      park.summary ||
      `Описание, цены, услуги и контакты вейк-парка ${park.title} в городе ${city.title}.`,
    openGraph: {
      title: park.meta?.title || `${park.title} — вейк-парк ${city.title}`,
      description: park.meta?.description || park.summary || `Вейк-парк ${park.title} в городе ${city.title}.`,
    },
  }
}

export default async function ParkPage({ params: paramsPromise }: Args) {
  const { citySlug, parkSlug } = await paramsPromise
  const city = await getCityBySlug(decodeURIComponent(citySlug))

  if (!city) notFound()

  const park = await getParkBySlug(city.id, decodeURIComponent(parkSlug))

  if (!park) notFound()

  const [reviews, sameCityParks, priceRows] = await Promise.all([
    getReviewsByPark(park.id),
    getParksByCity(city.id),
    getPricesByPark(park.id),
  ])

  const displayPrices: PriceLike[] = priceRows.length
    ? priceRows
    : (park.prices || []).map((price, index) => ({
        id: price.id || `legacy-${index}`,
        title: price.title,
        description: price.description,
        price: price.price,
        duration: price.duration,
        category: 'other',
        sortOrder: index,
      }))
  const activeFeatures = Object.entries(park.features || {}).filter(([, enabled]) => enabled)
  const groupedFeatures = getGroupedActiveFeatures(park.features)
  const heroImage = park.cardImage || park.gallery?.[0]
  const heroImageUrl = getImageUrl(heroImage, 'large')
  const galleryImages = (park.gallery || []).filter((image) => getImageUrl(image, 'medium'))
  const objectPosition = getObjectPosition(park.imageSettings?.objectPosition)
  const similarParks = sameCityParks.filter((item) => item.id !== park.id).slice(0, 3)
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : null
  const activeFeatureKeys = activeFeatures.map(([feature]) => feature)
  const favoriteSnapshot = {
    id: String(park.id),
    title: park.title || 'Вейк-парк',
    cityTitle: city.title,
    citySlug: city.slug || citySlug,
    parkSlug: park.slug || parkSlug,
    summary: park.summary,
    priceFrom: park.priceFrom || null,
    rating: park.rating || null,
    address: park.location?.address,
    cableTypes: park.cableTypes || [],
    features: activeFeatureKeys,
    href: '/wake-parks/' + (city.slug || citySlug) + '/' + (park.slug || parkSlug),
  }

  return (
    <main>
      <section className="border-b border-border bg-gradient-to-br from-cyan-50 via-background to-emerald-50 dark:from-slate-950 dark:via-background dark:to-cyan-950">
        <div className="container py-10 md:py-20">
          <Breadcrumbs items={[{ href: '/wake-parks', label: 'Парки' }, { href: '/wake-parks/' + (city.slug || citySlug), label: city.title || 'Город' }, { label: park.title || 'Вейк-парк' }]} />
          <Link className="text-sm font-medium text-primary hover:underline" href={`/wake-parks/${city.slug || citySlug}`}>
            ← Вейк-парки {city.title}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              {heroImageUrl ? (
                <div className="mb-8 overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
                  <img
                    alt={getImageAlt(heroImage, park.title || 'Вейк-парк')}
                    className={`h-[260px] w-full object-cover md:h-[420px] ${objectPosition}`}
                    src={heroImageUrl}
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {park.isVerified && <Badge>Проверенный парк</Badge>}
                {park.isClaimed && <Badge>Подтверждено владельцем</Badge>}
                {park.isFeatured && <Badge>Рекомендуем</Badge>}
                {park.rating ? <Badge>★ {park.rating}</Badge> : null}
                {averageRating ? <Badge>Отзывы: ★ {averageRating}</Badge> : null}
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">{park.title}</h1>
              <p className="mt-5 max-w-3xl text-lg text-muted-foreground">{park.summary}</p>
            </div>

            <aside className="rounded-3xl border border-border bg-background/80 p-5 shadow-sm backdrop-blur md:p-6 lg:sticky lg:top-6 lg:self-start">
              <p className="text-sm text-muted-foreground">Цена</p>
              <p className="mt-1 text-3xl font-semibold">{park.priceFrom ? `от ${park.priceFrom} ₽` : 'уточняется'}</p>
              <div className="mt-6 grid gap-3">
                <FavoriteButton park={favoriteSnapshot} />
                <CompareButton park={favoriteSnapshot} />
                {park.contacts?.phone && <ContactLink href={`tel:${park.contacts.phone}`} label="Позвонить" />}
                {park.contacts?.website && <ContactLink href={park.contacts.website} label="Сайт парка" external />}
                {park.contacts?.vk && <ContactLink href={park.contacts.vk} label="VK" external />}
                {park.contacts?.telegram && <ContactLink href={park.contacts.telegram} label="Telegram" external />}
                {park.location?.yandexMapsUrl && <ContactLink href={park.location.yandexMapsUrl} label="Открыть маршрут" external />}
                <Link
                  className="rounded-full border border-border px-5 py-3 text-center font-medium hover:bg-secondary"
                  href={`/update-park?park=${park.id}`}
                >
                  Обновить данные
                </Link>
                <Link
                  className="rounded-full border border-border px-5 py-3 text-center font-medium hover:bg-secondary"
                  href={`/for-parks?park=${park.id}#claim-form`}
                >
                  Я владелец этого парка
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <article className="space-y-8">
            <Block title="Описание">
              <p className="whitespace-pre-wrap text-muted-foreground">{park.description || park.summary}</p>
            </Block>

            {park.cableTypes?.length ? (
              <Block title="Типы катания">
                <div className="flex flex-wrap gap-2">
                  {park.cableTypes.map((type) => (
                    <Badge key={type}>{cableTypeLabels[type] || type}</Badge>
                  ))}
                </div>
              </Block>
            ) : null}

            {groupedFeatures.length ? (
              <Block title="Услуги и инфраструктура">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {groupedFeatures.map((group) => (
                    <section className="rounded-3xl border border-border bg-background p-5" key={group.title}>
                      <h3 className="text-lg font-semibold">{group.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {group.items.map((feature) => (
                          <span className="rounded-full bg-secondary px-3 py-1 text-sm" key={feature}>
                            {featureLabels[feature] || feature}
                          </span>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </Block>
            ) : null}

            {displayPrices.length ? (
              <Block title="Цены">
                <PriceTable prices={displayPrices} />
              </Block>
            ) : null}

            {galleryImages.length ? (
              <Block title="Фотографии">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryImages.map((image, index) => {
                    const url = getImageUrl(image, 'medium')
                    if (!url) return null
                    return (
                      <a
                        className="group block overflow-hidden rounded-3xl border border-border bg-background"
                        href={getImageUrl(image, 'large') || url}
                        key={`${url}-${index}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          alt={getImageAlt(image, `${park.title || 'Вейк-парк'} — фото ${index + 1}`)}
                          className={`h-56 w-full object-cover transition duration-300 group-hover:scale-105 ${objectPosition}`}
                          src={url}
                        />
                      </a>
                    )
                  })}
                </div>
              </Block>
            ) : null}

            <Block title="Отзывы">
              {reviews.length ? (
                <div className="grid gap-4">
                  {reviews.map((review) => (
                    <article className="rounded-3xl border border-border bg-background p-5" key={review.id}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{review.authorName}</p>
                          <p className="text-sm text-muted-foreground">{review.source ? sourceLabel(review.source) : 'Форма сайта'}</p>
                        </div>
                        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">★ {review.rating}</span>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap text-muted-foreground">{review.text}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Пока нет опубликованных отзывов. Первый отзыв можно отправить через форму ниже.</p>
              )}
              <ReviewForm parkId={park.id} />
            </Block>

            {similarParks.length ? (
              <Block title={`Другие парки в городе ${city.title}`}>
                <div className="grid gap-3">
                  {similarParks.map((item) => (
                    <Link className="rounded-2xl border border-border p-4 hover:bg-secondary" href={`/wake-parks/${city.slug}/${item.slug}`} key={item.id}>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.priceFrom ? `от ${item.priceFrom} ₽` : 'Цена уточняется'}</p>
                    </Link>
                  ))}
                </div>
              </Block>
            ) : null}
          </article>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">Контакты и локация</h2>
              <Info label="Город" value={city.title} />
              <Info label="Адрес" value={park.location?.address} />
              <Info label="Район / ориентир" value={park.location?.district} />
              <Info label="График" value={park.workTime} />
              <Info label="Сезон" value={park.season} />
              <Info label="Телефон" value={park.contacts?.phone} />
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">Данные карточки</h2>
              {park.isClaimed ? (
                <p className="mt-3 rounded-2xl bg-blue-50 p-3 text-sm font-medium text-blue-900 dark:bg-blue-950 dark:text-blue-100">
                  Карточка подтверждена владельцем или официальным представителем.
                </p>
              ) : (
                <p className="mt-3 rounded-2xl bg-secondary p-3 text-sm text-muted-foreground">
                  Карточка пока не подтверждена владельцем.
                </p>
              )}
              <Info label="Последняя проверка" value={park.dataQuality?.lastCheckedAt ? formatShortDate(park.dataQuality.lastCheckedAt) : undefined} />
              <Info label="Комментарий" value={park.dataQuality?.freshnessNote} />
              {park.dataQuality?.sourceUrl ? (
                <a
                  className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                  href={park.dataQuality.sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Источник проверки →
                </a>
              ) : null}
              <p className="mt-4 text-sm text-muted-foreground">
                Если заметил ошибку в цене, графике, адресе или контактах, отправь правку через форму ниже.
              </p>
            </div>

            <ReportIssueForm parkId={park.id} />
          </aside>
        </div>
      </section>
    </main>
  )
}

type PriceLike = Pick<PriceDoc, 'id' | 'title' | 'category' | 'description' | 'price' | 'weekdayPrice' | 'weekendPrice' | 'duration' | 'sortOrder'>

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">{children}</span>
}

function Block({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function PriceTable({ prices }: { prices: PriceLike[] }) {
  const groups = groupPrices(prices)

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section className="overflow-hidden rounded-3xl border border-border bg-background" key={group.category}>
          <div className="border-b border-border bg-secondary/60 px-4 py-3">
            <h3 className="font-semibold">{priceCategoryLabel(group.category)}</h3>
          </div>
          <div className="divide-y divide-border">
            {group.items.map((price) => (
              <div className="grid gap-3 p-4 md:grid-cols-[1fr_220px]" key={String(price.id || price.title)}>
                <div>
                  <p className="font-medium">{price.title}</p>
                  {price.description && <p className="mt-1 text-sm text-muted-foreground">{price.description}</p>}
                  {price.duration && <p className="mt-2 text-sm text-muted-foreground">Длительность: {price.duration}</p>}
                </div>
                <div className="rounded-2xl bg-card p-3 text-sm md:text-right">
                  <p className="text-lg font-semibold">{price.price ? `${price.price} ₽` : 'уточняется'}</p>
                  {(price.weekdayPrice || price.weekendPrice) && (
                    <div className="mt-2 space-y-1 text-muted-foreground">
                      {price.weekdayPrice ? <p>Будни: {price.weekdayPrice} ₽</p> : null}
                      {price.weekendPrice ? <p>Выходные: {price.weekendPrice} ₽</p> : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function groupPrices(prices: PriceLike[]) {
  const order = ['wake', 'training', 'rent', 'sup', 'package', 'other']
  return order
    .map((category) => ({ category, items: prices.filter((price) => (price.category || 'other') === category) }))
    .filter((group) => group.items.length > 0)
}

function priceCategoryLabel(category?: string) {
  switch (category) {
    case 'wake':
      return 'Вейкборд и сеты'
    case 'training':
      return 'Обучение'
    case 'rent':
      return 'Аренда оборудования'
    case 'sup':
      return 'SUP и вода'
    case 'package':
      return 'Абонементы и пакеты'
    case 'other':
    default:
      return 'Прочее'
  }
}

function formatShortDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ru-RU')
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}

function ContactLink({ external, href, label }: { external?: boolean; href: string; label: string }) {
  const isExternal = external || href.startsWith('http')

  return (
    <a
      className="rounded-full bg-primary px-5 py-3 text-center font-medium text-primary-foreground"
      href={href}
      rel={isExternal ? 'noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      {label}
    </a>
  )
}

function sourceLabel(source: string) {
  switch (source) {
    case 'vk':
      return 'VK'
    case 'yandex':
      return 'Яндекс.Карты'
    case '2gis':
      return '2ГИС'
    case 'admin':
      return 'Добавлен администратором'
    case 'site':
    default:
      return 'Форма сайта'
  }
}
