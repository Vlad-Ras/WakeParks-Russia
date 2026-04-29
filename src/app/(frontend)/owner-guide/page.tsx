import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'

export const metadata = {
  title: 'Гайд владельца вейк-парка — Wake Parks Russia',
  description: 'Как подготовить карточку вейк-парка: данные, цены, фото, контакты, подтверждение и продвижение.',
}

const checklist = [
  ['Название и город', 'Проверь, что название совпадает с официальными картами, сайтом и соцсетями.'],
  ['Адрес и маршрут', 'Добавь точный адрес, район/ориентир и ссылку на Яндекс.Карты или 2ГИС.'],
  ['Цены', 'Раздели прайс на сеты, обучение, аренду, SUP, пакеты и прочее.'],
  ['Услуги', 'Отметь обучение, аренду, детскую школу, кафе, душ, раздевалку, парковку, пляж.'],
  ['Фото', 'Лучше 5–10 горизонтальных фото: вода, канатка, зона отдыха, обучение, общий вид.'],
  ['Контакты', 'Укажи телефон, сайт, VK, Telegram и актуальный график работы.'],
  ['Актуальность', 'Раз в сезон проверяй цены, график и ссылки, чтобы карточка не устаревала.'],
]

export default function OwnerGuidePage() {
  return (
    <main>
      <section className="border-b border-border bg-gradient-to-br from-cyan-50 via-background to-emerald-50 dark:from-slate-950 dark:via-background dark:to-cyan-950">
        <div className="container py-12 md:py-20">
          <Breadcrumbs items={[{ href: '/for-parks', label: 'Для парков' }, { label: 'Гайд владельца' }]} />
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Инструкция</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Как подготовить сильную карточку вейк-парка</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            Хорошая карточка должна быстро отвечать на вопросы пользователя: где находится парк, сколько стоит катание, чему можно научиться, есть ли аренда и как связаться.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground" href="/for-parks#claim-form">
              Подтвердить карточку
            </Link>
            <Link className="rounded-full border border-border bg-background px-6 py-3 font-medium hover:bg-secondary" href="/update-park">
              Обновить данные
            </Link>
          </div>
        </div>
      </section>

      <section className="container grid gap-5 py-12 md:grid-cols-2">
        {checklist.map(([title, text]) => (
          <article className="rounded-3xl border border-border bg-card p-6" key={title}>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="mt-3 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>

      <section className="container pb-12">
        <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-semibold tracking-tight">Минимальный набор для публикации</h2>
          <div className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <p>• название, город, адрес и ссылка на карту;</p>
            <p>• краткое описание и 1–3 главные услуги;</p>
            <p>• цена «от» и хотя бы 2–3 строки прайса;</p>
            <p>• телефон или Telegram для связи;</p>
            <p>• главное изображение карточки;</p>
            <p>• статус «Опубликовано» после модерации.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
