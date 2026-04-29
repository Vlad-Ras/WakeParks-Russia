import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { getParks } from '../_wake/queries'
import { ClaimParkForm } from './ClaimParkForm'

export const metadata = {
  title: 'Для владельцев вейк-парков — Wake Parks Russia',
  description: 'Подтвердите карточку парка, отправьте актуальные данные, цены, фото и обсудите продвижение в каталоге.',
}

type Args = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ForParksPage({ searchParams: searchParamsPromise }: Args) {
  const searchParams = (await searchParamsPromise) || {}
  const initialParkId = Array.isArray(searchParams.park) ? searchParams.park[0] : searchParams.park
  const parks = await getParks(1000)

  return (
    <main>
      <section className="border-b border-border bg-gradient-to-br from-cyan-50 via-background to-emerald-50 dark:from-slate-950 dark:via-background dark:to-cyan-950">
        <div className="container py-12 md:py-20">
          <Breadcrumbs items={[{ label: 'Для парков' }]} />
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Владельцам и управляющим</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Подтверди и улучши карточку своего вейк-парка</h1>
              <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
                Карточка с подтверждением владельца выглядит надёжнее, чаще обновляется и лучше помогает пользователю выбрать парк: цены, контакты, фото, услуги и график не теряются.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="#claim-form">
                  Подтвердить карточку
                </Link>
                <Link className="rounded-full border border-border px-6 py-3 font-medium hover:bg-secondary" href="/owner-guide">
                  Гайд владельца
                </Link>
                <Link className="rounded-full border border-border px-6 py-3 font-medium hover:bg-secondary" href="/add-park">
                  Добавить новый парк
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-sm backdrop-blur">
              <h2 className="text-2xl font-semibold">Что появится в карточке</h2>
              <div className="mt-5 grid gap-3 text-sm text-muted-foreground">
                <p>• бейдж «Подтверждено владельцем»;</p>
                <p>• дата последней проверки данных;</p>
                <p>• актуальные цены и график;</p>
                <p>• правильные контакты и ссылки;</p>
                <p>• фото, услуги и инфраструктура;</p>
                <p>• понятная связь с владельцем для будущих обновлений.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard title="1. Подготовь подтверждение" text="Подойдут официальный сайт, VK, Яндекс.Карты, 2ГИС, пост с актуальным прайсом или контакт, совпадающий с карточкой парка." />
          <InfoCard title="2. Отправь заявку" text="Выбери парк, отметь нужные действия, оставь контакты и ссылки. Заявка попадёт в Payload: «Wake каталог → Заявки владельцев»." />
          <InfoCard title="3. Обнови карточку" text="После проверки администратор включает бейдж, обновляет данные и фиксирует дату последней проверки карточки." />
        </div>
      </section>

      <section className="container grid gap-8 pb-12 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-4">
          <InfoCard title="Что можно запросить" text="Подтверждение карточки, обновление контактов, цен, фото, графика, услуг, инфраструктуры или обсуждение платного продвижения." />
          <InfoCard title="Что не происходит автоматически" text="Заявка не создаёт личный кабинет и не даёт прямой доступ к редактированию. На MVP-этапе всё проверяется вручную администратором." />
          <InfoCard title="После отправки" text="Откроется страница с дальнейшими шагами: что ждать, где обновлять данные и как ускорить проверку." />
        </aside>

        <section id="claim-form">
          <ClaimParkForm initialParkId={initialParkId} parks={parks} />
        </section>
      </section>
    </main>
  )
}

function InfoCard({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
