import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { getSiteSettings, normalizeTelegramUrl } from '@/app/(frontend)/_wake/siteSettings'

const footerGroups = [
  {
    title: 'Каталог',
    links: [
      { href: '/wake-parks', label: 'Все парки' },
      { href: '/cities', label: 'Города' },
      { href: '/regions', label: 'Регионы' },
      { href: '/map', label: 'Карта' },
    ],
  },
  {
    title: 'Выбор парка',
    links: [
      { href: '/pick', label: 'Подбор' },
      { href: '/best', label: 'Лучшие' },
      { href: '/new-parks', label: 'Новые' },
      { href: '/recently-updated', label: 'Обновления' },
      { href: '/favorites', label: 'Избранное' },
      { href: '/compare', label: 'Сравнение' },
    ],
  },
  {
    title: 'Подборки',
    links: [
      { href: '/training', label: 'Новичкам' },
      { href: '/kids', label: 'Детям' },
      { href: '/sup', label: 'SUP и отдых' },
      { href: '/cable-wake', label: 'Канатки' },
      { href: '/guides', label: 'Гайды' },
    ],
  },
  {
    title: 'Для парков',
    links: [
      { href: '/add-park', label: 'Добавить парк' },
      { href: '/update-park', label: 'Обновить данные' },
      { href: '/for-parks', label: 'Владельцам' },
      { href: '/owner-guide', label: 'Гайд владельца' },
      { href: '/advertising', label: 'Реклама' },
    ],
  },
  {
    title: 'Проект',
    links: [
      { href: '/about', label: 'О проекте' },
      { href: '/contacts', label: 'Контакты' },
      { href: '/privacy', label: 'Политика ПДн' },
      { href: '/terms', label: 'Соглашение' },
      { href: '/cookies', label: 'Cookies' },
    ],
  },
]

const serviceLinks = [
  { href: '/search', label: 'Поиск' },
  { href: '/launch-checklist', label: 'Чеклист запуска' },
  { href: '/data-tools', label: 'Импорт / экспорт' },
]

export async function Footer() {
  const [footerData, settings] = await Promise.all([getCachedGlobal('footer', 1)(), getSiteSettings()])
  const navItems = footerData?.navItems || []
  const tagline = settings.tagline || 'Каталог вейкборд-парков России: города, цены, обучение, инфраструктура, отзывы и маршруты.'
  const telegramUrl = normalizeTelegramUrl(settings.contacts?.telegram)

  return (
    <footer className="mt-auto border-t border-border bg-black text-white dark:bg-card">
      <div className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_2.4fr] lg:items-start">
          <div>
            <Link className="inline-flex items-center" href="/" aria-label="Wake Parks Russia — на главную">
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{tagline}</p>

            {(settings.contacts?.publicEmail || settings.contacts?.phone || telegramUrl || settings.contacts?.vk) && (
              <div className="mt-5 grid gap-2 text-sm text-white/65">
                {settings.contacts?.publicEmail ? (
                  <a className="hover:text-white hover:underline" href={`mailto:${settings.contacts.publicEmail}`}>
                    {settings.contacts.publicEmail}
                  </a>
                ) : null}
                {settings.contacts?.phone ? (
                  <a className="hover:text-white hover:underline" href={`tel:${settings.contacts.phone}`}>
                    {settings.contacts.phone}
                  </a>
                ) : null}
                {telegramUrl ? (
                  <a className="hover:text-white hover:underline" href={telegramUrl} rel="noreferrer" target="_blank">
                    Telegram
                  </a>
                ) : null}
                {settings.contacts?.vk ? (
                  <a className="hover:text-white hover:underline" href={settings.contacts.vk} rel="noreferrer" target="_blank">
                    VK
                  </a>
                ) : null}
              </div>
            )}

            <div className="mt-5 inline-flex rounded-2xl border border-white/10 bg-white/5 p-2">
              <ThemeSelector />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {footerGroups.map((group) => (
              <nav aria-label={group.title} className="grid content-start gap-2 text-sm" key={group.title}>
                <p className="mb-1 font-semibold text-white">{group.title}</p>
                {group.links.map((item) => (
                  <Link className="text-white/64 transition-colors hover:text-white hover:underline" href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/55">
              {serviceLinks.map((item) => (
                <Link className="hover:text-white hover:underline" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
              {navItems.map(({ link }, i) => {
                return <CMSLink className="text-white/55 hover:text-white" key={i} {...link} />
              })}
            </div>
            <p className="text-xs text-white/40">MVP-версия агрегатора. Данные карточек требуют ручной проверки.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
