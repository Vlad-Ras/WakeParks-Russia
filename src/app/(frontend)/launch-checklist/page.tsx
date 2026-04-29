import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'

export const metadata = {
  title: 'Чеклист запуска каталога — Wake Parks Russia',
  description: 'Практический чеклист наполнения и проверки агрегатора вейкборд-парков перед публичным показом.',
}

const sections = [
  {
    title: 'Контент каталога',
    items: [
      'Добавить минимум 5–7 городов с SEO-описанием и обложкой.',
      'Добавить 15–25 парков: адрес, контакты, описание, цену от, услуги и типы катания.',
      'Поставить статус “Опубликовано” только проверенным карточкам.',
      'Указать дату последней проверки данных и источник.',
    ],
  },
  {
    title: 'Медиа',
    items: [
      'Добавить обложки городов.',
      'Добавить главное изображение парка и 3–6 фото в галерею.',
      'Проверить расположение изображения в карточке: сверху, слева, справа или фоном.',
      'Заполнить alt-тексты у изображений в Media.',
    ],
  },
  {
    title: 'SEO',
    items: [
      'Заполнить SEO title и SEO description у городов и парков.',
      'Проверить /sitemap.xml и /robots.txt.',
      'Проверить заголовки H1 на главной, городе, парке и гайдах.',
      'Добавить 3–5 гайдов под информационные запросы.',
    ],
  },
  {
    title: 'Формы и модерация',
    items: [
      'Проверить форму /add-park.',
      'Проверить форму отзыва на странице парка.',
      'Проверить форму “Сообщить об ошибке”.',
      'Проверить заявку владельца на /for-parks.',
    ],
  },
  {
    title: 'Публичный показ',
    items: [
      'Запустить pnpm dev.',
      'Открыть сайт локально на http://localhost:3000.',
      'Запустить cloudflared или ngrok.',
      'Проверить публичную ссылку с телефона.',
    ],
  },
  {
    title: 'Юридические страницы',
    items: [
      'Заменить MVP-заготовку /privacy на финальную политику ПДн.',
      'Заменить MVP-заготовку /terms на финальное пользовательское соглашение.',
      'Проверить /cookies и cookie-баннер.',
      'Добавить реальные реквизиты, email и контакты проекта.',
    ],
  },
]

export default function LaunchChecklistPage() {
  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ label: 'Чеклист запуска' }]} />

      <section className="rounded-3xl border border-border bg-card p-8 md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Подготовка MVP</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
          Чеклист перед публичным показом
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
          Это рабочий список того, что нужно заполнить и проверить, чтобы агрегатор выглядел не как пустая заготовка,
          а как понятный MVP для демонстрации владельцам парков и первым пользователям.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground" href="/add-park">
            Добавить парк
          </Link>
          <Link className="rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-secondary" href="/pick">
            Проверить подбор
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <article className="rounded-3xl border border-border bg-card p-6" key={section.title}>
            <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <ul className="mt-5 grid gap-3 text-muted-foreground">
              {section.items.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  )
}
