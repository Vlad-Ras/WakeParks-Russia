import Link from 'next/link'

import type { CityDoc, ParkDoc } from './queries'
import { cableTypeLabels, featureLabels, getGroupedActiveFeatures } from './labels'
import { getCityFromPark, getParkHref } from './queries'
import { FavoriteButton } from './FavoriteButton'
import { CompareButton } from './CompareButton'
import { getImageAlt, getImageUrl, getObjectPosition } from './media'

export function CityCard({ city, parksCount }: { city: CityDoc; parksCount?: number }) {
  const imageUrl = getImageUrl(city.coverImage, 'medium')
  const placement = city.imageSettings?.cardImagePlacement || 'top'
  const objectPosition = getObjectPosition(city.imageSettings?.objectPosition)

  const content = (
    <div className={placement === 'background' ? 'relative z-10 p-6' : 'p-6'}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={placement === 'background' ? 'text-sm text-white/80' : 'text-sm text-muted-foreground'}>
            {city.region || 'Россия'}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{city.title}</h3>
        </div>
        <span className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
          {parksCount === undefined ? 'город' : `${parksCount} парк${parksCount === 1 ? '' : 'ов'}`}
        </span>
      </div>
      {city.summary && (
        <p className={placement === 'background' ? 'mt-4 line-clamp-3 text-white/85' : 'mt-4 line-clamp-3 text-muted-foreground'}>
          {city.summary}
        </p>
      )}
      <p className={placement === 'background' ? 'mt-6 font-medium text-white group-hover:underline' : 'mt-6 font-medium text-primary group-hover:underline'}>
        Смотреть парки →
      </p>
    </div>
  )

  if (imageUrl && placement === 'background') {
    return (
      <Link
        className="group relative min-h-72 overflow-hidden rounded-3xl border border-border bg-card text-white transition hover:-translate-y-1 hover:shadow-xl"
        href={`/wake-parks/${city.slug}`}
      >
        <img
          alt={getImageAlt(city.coverImage, `Вейк-парки ${city.title}`)}
          className={`absolute inset-0 h-full w-full object-cover ${objectPosition}`}
          src={imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        {content}
      </Link>
    )
  }

  const image = imageUrl ? (
    <div className={placement === 'left' || placement === 'right' ? 'min-h-56 md:min-h-full' : 'h-52'}>
      <img
        alt={getImageAlt(city.coverImage, `Вейк-парки ${city.title}`)}
        className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${objectPosition}`}
        src={imageUrl}
      />
    </div>
  ) : (
    <div className={placement === 'left' || placement === 'right' ? 'flex min-h-56 items-center justify-center bg-gradient-to-br from-cyan-100 via-sky-100 to-emerald-100 p-6 text-center dark:from-cyan-950 dark:via-slate-900 dark:to-emerald-950 md:min-h-full' : 'flex h-52 items-center justify-center bg-gradient-to-br from-cyan-100 via-sky-100 to-emerald-100 p-6 text-center dark:from-cyan-950 dark:via-slate-900 dark:to-emerald-950'}>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">Город</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{city.title}</p>
      </div>
    </div>
  )

  return (
    <Link
      className={
        placement === 'left' || placement === 'right'
          ? 'group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:grid md:grid-cols-[220px_1fr]'
          : 'group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl'
      }
      href={`/wake-parks/${city.slug}`}
    >
      {placement === 'right' ? (
        <>
          {content}
          {image}
        </>
      ) : (
        <>
          {image}
          {content}
        </>
      )}
    </Link>
  )
}

export function ParkCard({ park }: { park: ParkDoc }) {
  const city = getCityFromPark(park)
  const href = getParkHref(park)
  const activeFeatures = Object.entries(park.features || {})
    .filter(([, enabled]) => enabled)
    .slice(0, 4)
  const groupedFeatures = getGroupedActiveFeatures(park.features)
  const primaryImage = park.cardImage || park.gallery?.[0]
  const imageUrl = getImageUrl(primaryImage, 'medium')
  const placement = park.imageSettings?.cardImagePlacement || 'top'
  const objectPosition = getObjectPosition(park.imageSettings?.objectPosition)
  const favoriteSnapshot = {
    id: String(park.id),
    title: park.title || 'Вейк-парк',
    cityTitle: city?.title,
    citySlug: city?.slug,
    parkSlug: park.slug,
    summary: park.summary,
    priceFrom: park.priceFrom || null,
    rating: park.rating || null,
    address: park.location?.address,
    cableTypes: park.cableTypes || [],
    features: activeFeatures.map(([feature]) => feature),
    href,
  }

  const content = (
    <div className={placement === 'background' ? 'relative z-10 flex h-full flex-col p-6' : 'flex flex-1 flex-col p-6'}>
      <Link className="flex flex-1 flex-col" href={href}>
        <div className="flex flex-wrap items-center gap-2">
          {park.isVerified && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              Проверен
            </span>
          )}
          {park.isClaimed && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              Подтверждено владельцем
            </span>
          )}
          {park.isFeatured && (
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
              Рекомендуем
            </span>
          )}
          {park.rating ? (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">★ {park.rating}</span>
          ) : null}
        </div>

        <h3 className="mt-4 text-2xl font-semibold tracking-tight">{park.title}</h3>
        <p className={placement === 'background' ? 'mt-1 text-sm text-white/75' : 'mt-1 text-sm text-muted-foreground'}>
          {city?.title || 'Город не указан'}
        </p>
        {park.dataQuality?.lastCheckedAt ? (
          <p className={placement === 'background' ? 'mt-2 text-xs text-white/70' : 'mt-2 text-xs text-muted-foreground'}>
            Данные проверены: {formatShortDate(park.dataQuality.lastCheckedAt)}
          </p>
        ) : null}
        <p className={placement === 'background' ? 'mt-4 line-clamp-3 flex-1 text-white/85' : 'mt-4 line-clamp-3 flex-1 text-muted-foreground'}>
          {park.summary}
        </p>

        {park.cableTypes?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {park.cableTypes.slice(0, 3).map((type) => (
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-foreground" key={type}>
                {cableTypeLabels[type] || type}
              </span>
            ))}
          </div>
        ) : null}

        {groupedFeatures.length ? (
          <div className="mt-4 space-y-3">
            {groupedFeatures.slice(0, 2).map((group) => (
              <div key={group.title}>
                <p className={placement === 'background' ? 'mb-2 text-xs font-medium uppercase tracking-wide text-white/70' : 'mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'}>
                  {group.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.slice(0, 3).map((feature) => (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground" key={feature}>
                      {featureLabels[feature] || feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
        <div>
          <p className={placement === 'background' ? 'text-xs text-white/70' : 'text-xs text-muted-foreground'}>Цена</p>
          <p className="text-xl font-semibold">{park.priceFrom ? `от ${park.priceFrom} ₽` : 'уточняется'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <FavoriteButton compact park={favoriteSnapshot} />
          <CompareButton compact park={favoriteSnapshot} />
          <Link className={placement === 'background' ? 'font-medium text-white group-hover:underline' : 'font-medium text-primary group-hover:underline'} href={href}>
            Подробнее →
          </Link>
        </div>
      </div>
    </div>
  )

  if (imageUrl && placement === 'background') {
    return (
      <article className="group relative min-h-[520px] overflow-hidden rounded-3xl border border-border bg-card text-white transition hover:-translate-y-1 hover:shadow-xl">
        <img
          alt={getImageAlt(primaryImage, park.title || 'Вейк-парк')}
          className={`absolute inset-0 h-full w-full object-cover ${objectPosition}`}
          src={imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
        {content}
      </article>
    )
  }

  const image = imageUrl ? (
    <Link className={placement === 'left' || placement === 'right' ? 'block min-h-64 md:min-h-full' : 'block h-56'} href={href}>
      <img
        alt={getImageAlt(primaryImage, park.title || 'Вейк-парк')}
        className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${objectPosition}`}
        src={imageUrl}
      />
    </Link>
  ) : (
    <Link className={placement === 'left' || placement === 'right' ? 'block min-h-64 md:min-h-full' : 'block h-56'} href={href}>
      <div className="flex h-full min-h-full items-center justify-center bg-gradient-to-br from-cyan-100 via-sky-100 to-emerald-100 p-6 text-center dark:from-cyan-950 dark:via-slate-900 dark:to-emerald-950">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">Wake Park</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{park.title || 'Вейк-парк'}</p>
          <p className="mt-2 text-sm text-muted-foreground">Фото можно добавить в админке</p>
        </div>
      </div>
    </Link>
  )

  return (
    <article
      className={
        placement === 'left' || placement === 'right'
          ? 'group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:grid md:grid-cols-[240px_1fr]'
          : 'group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl'
      }
    >
      {placement === 'right' ? (
        <>
          {content}
          {image}
        </>
      ) : (
        <>
          {image}
          {content}
        </>
      )}
    </article>
  )
}

function formatShortDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ru-RU')
}

export function EmptyCatalogHint() {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-2xl">≈</div>
      <h2 className="mt-5 text-2xl font-semibold">Каталог пока пустой</h2>
      <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
        Зайди в админку Payload, создай город в разделе «Wake каталог → Города», затем добавь парк в
        «Wake каталог → Вейк-парки». После этого карточки появятся на сайте автоматически.
      </p>
      <Link
        className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
        href="/admin"
      >
        Открыть админку
      </Link>
    </div>
  )
}
