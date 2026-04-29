import Link from 'next/link'

import { Breadcrumbs } from '../_wake/Breadcrumbs'
import { getSiteSettings, normalizeTelegramUrl } from '../_wake/siteSettings'
import { ContactForm } from './ContactForm'

export const metadata = {
  title: 'Контакты — Wake Parks Russia',
  description: 'Связаться с проектом Wake Parks Russia: вопросы по каталогу, партнёрство, обновление данных и реклама.',
}

export default async function ContactsPage() {
  const settings = await getSiteSettings()
  const telegramUrl = normalizeTelegramUrl(settings.contacts?.telegram)
  const contactLinks = [
    settings.contacts?.publicEmail
      ? { href: `mailto:${settings.contacts.publicEmail}`, label: settings.contacts.publicEmail, text: 'Email проекта' }
      : null,
    settings.contacts?.phone
      ? { href: `tel:${settings.contacts.phone}`, label: settings.contacts.phone, text: 'Телефон проекта' }
      : null,
    telegramUrl ? { href: telegramUrl, label: 'Telegram', text: 'Быстрая связь' } : null,
    settings.contacts?.vk ? { href: settings.contacts.vk, label: 'VK', text: 'Сообщество проекта' } : null,
  ].filter(Boolean) as Array<{ href: string; label: string; text: string }>

  return (
    <main className="container py-10 md:py-14">
      <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Контакты' }]} />

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Связь</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Контакты проекта</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Напиши, если нужно добавить парк, обновить данные, обсудить партнёрство, рекламу или сообщить об ошибке в каталоге.
          </p>

          {contactLinks.length ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {contactLinks.map((item) => (
                <a className="rounded-3xl border border-border bg-card p-5 hover:bg-secondary" href={item.href} key={item.href} rel="noreferrer" target={item.href.startsWith('http') ? '_blank' : undefined}>
                  <h2 className="text-lg font-semibold">{item.label}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                </a>
              ))}
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ['Добавить парк', 'Для новых площадок и владельцев', '/add-park'],
              ['Обновить данные', 'Цены, график, контакты, фото', '/update-park'],
              ['Для владельцев', 'Подтверждение карточки и партнёрство', '/for-parks'],
              ['Импорт / экспорт', 'Служебные инструменты наполнения', '/data-tools'],
            ].map(([title, text, href]) => (
              <Link className="rounded-3xl border border-border bg-card p-5 hover:bg-secondary" href={href} key={href}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Настройки контактов</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Email, телефон, Telegram и VK теперь редактируются в админке: <strong>4. Система → Настройки сайта → Контакты проекта</strong>.
          </p>
          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground">
            <li>• обращения сохраняются в Payload CMS;</li>
            <li>• публично данные отправителей не выводятся;</li>
            <li>• форму можно включить или выключить в настройках сайта;</li>
            <li>• honeypot-защита настраивается без правки кода.</li>
          </ul>
        </aside>
      </section>

      <section className="mt-10">
        {settings.forms?.contactFormEnabled === false ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <h2 className="text-2xl font-semibold">Форма контактов временно отключена</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Включить её можно в админке: 4. Система → Настройки сайта → Формы и модерация.
            </p>
          </div>
        ) : (
          <ContactForm />
        )}
      </section>
    </main>
  )
}
