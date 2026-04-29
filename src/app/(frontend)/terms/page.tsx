import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'

export const metadata = {
  title: 'Пользовательское соглашение — Wake Parks Russia',
  description: 'Черновик пользовательского соглашения для MVP сайта Wake Parks Russia.',
}

const sections = [
  ['1. Статус проекта', 'Wake Parks Russia является информационным каталогом вейкборд-парков. Сайт не является официальным сайтом всех размещённых парков, если обратное прямо не указано в карточке.'],
  ['2. Информация в карточках', 'Администратор стремится поддерживать актуальность данных, но цены, график, услуги и контакты могут изменяться. Перед поездкой рекомендуется проверять информацию на официальных ресурсах парка.'],
  ['3. Действия пользователей', 'Пользователь может отправлять отзывы, правки, заявки на добавление парков и обращения. Запрещено отправлять спам, недостоверные сведения, оскорбления и материалы, нарушающие права третьих лиц.'],
  ['4. Модерация', 'Администратор вправе проверять, редактировать, скрывать или отклонять пользовательские материалы, если они не соответствуют назначению каталога.'],
  ['5. Ответственность', 'Сайт не несёт ответственность за изменения цен, расписаний, условий посещения, качество услуг конкретного парка и действия сторонних организаций.'],
  ['6. Изменение условий', 'Условия могут обновляться по мере развития проекта. Перед продакшеном этот раздел нужно заменить финальным юридическим документом.'],
]

export default function TermsPage() {
  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Пользовательское соглашение' }]} />
      <article className="mx-auto mt-8 max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Юридический раздел</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Пользовательское соглашение</h1>
        <p className="mt-5 text-muted-foreground">
          Это черновая версия для MVP. Она фиксирует базовые правила работы каталога и пользовательских форм.
        </p>
        <div className="mt-8 grid gap-5">
          {sections.map(([title, text]) => (
            <section className="rounded-3xl border border-border bg-card p-6" key={title}>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-muted-foreground">{text}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground" href="/privacy">Политика ПДн</Link>
          <Link className="rounded-2xl border border-border px-5 py-3 font-medium" href="/cookies">Cookie</Link>
        </div>
      </article>
    </main>
  )
}
