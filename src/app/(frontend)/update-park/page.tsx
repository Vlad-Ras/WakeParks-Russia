import type { Metadata } from 'next'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { getCityFromPark, getParks } from '../_wake/queries'
import { getSiteSettings } from '../_wake/siteSettings'
import { UpdateParkForm } from './UpdateParkForm'

export const metadata: Metadata = {
  title: 'Обновить данные парка — Wake Parks Russia',
  description: 'Отправьте актуальные цены, контакты, график работы или услуги вейк-парка на модерацию.',
}

type Args = {
  searchParams?: Promise<{
    park?: string
  }>
}

export default async function UpdateParkPage({ searchParams }: Args) {
  const params = await searchParams
  const [parks, settings] = await Promise.all([getParks(1000), getSiteSettings()])
  const options = parks.map((park) => {
    const city = getCityFromPark(park)
    return {
      id: String(park.id),
      title: park.title || 'Вейк-парк',
      cityTitle: city?.title,
      href: city?.slug && park.slug ? `/wake-parks/${city.slug}/${park.slug}` : undefined,
    }
  })

  return (
    <main className="container py-10 md:py-16">
      <Breadcrumbs items={[{ label: 'Обновить данные' }]} />
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Актуальность каталога</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Обновить данные парка</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            Если цена, график, адрес, контакты или список услуг изменились, отправь правку. Она попадёт в админку и будет опубликована после проверки.
          </p>
          <div className="mt-8">
            {settings.forms?.reportFormEnabled === false ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
                <h2 className="text-2xl font-semibold">Форма обновления данных временно отключена</h2>
                <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                  Включить её можно в админке: 4. Система → Настройки сайта → Формы и модерация.
                </p>
              </div>
            ) : (
              <UpdateParkForm parks={options} selectedParkId={params?.park} />
            )}
          </div>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-xl font-semibold">Что лучше прикладывать</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>ссылку на официальный сайт или VK парка;</li>
            <li>ссылку на Яндекс.Карты/2ГИС;</li>
            <li>точную дату, если это сезонный график;</li>
            <li>новую цену и единицу измерения: сет, час, день, абонемент.</li>
          </ul>
          <p className="mt-5 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
            Новые данные не меняют карточку автоматически. Это защищает каталог от спама и случайных ошибок.
          </p>
        </aside>
      </div>
    </main>
  )
}
