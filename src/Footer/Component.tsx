import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

const staticFooterLinks = [
  { href: '/cities', label: 'Города' },
  { href: '/regions', label: 'Регионы' },
  { href: '/wake-parks', label: 'Парки' },
  { href: '/best', label: 'Лучшие' },
  { href: '/new-parks', label: 'Новые' },
  { href: '/recently-updated', label: 'Обновления' },
  { href: '/pick', label: 'Подбор' },
  { href: '/training', label: 'Новичкам' },
  { href: '/kids', label: 'Детям' },
  { href: '/sup', label: 'SUP' },
  { href: '/cable-wake', label: 'Канатки' },
  { href: '/map', label: 'Карта' },
  { href: '/guides', label: 'Гайды' },
  { href: '/compare', label: 'Сравнение' },
  { href: '/for-parks', label: 'Для парков' },
  { href: '/owner-guide', label: 'Гайд владельца' },
  { href: '/advertising', label: 'Реклама' },
  { href: '/about', label: 'О проекте' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/privacy', label: 'Политика ПДн' },
  { href: '/terms', label: 'Соглашение' },
  { href: '/update-park', label: 'Обновить данные' },
  { href: '/add-park', label: 'Добавить парк' },
  { href: '/launch-checklist', label: 'Чеклист' },
  { href: '/data-tools', label: 'Импорт / экспорт' },
]

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black text-white dark:bg-card">
      <div className="container grid gap-8 py-8 md:grid-cols-[1.2fr_2fr] md:items-start">
        <div>
          <Link className="inline-flex items-center" href="/">
            <Logo />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-white/65">
            Каталог вейкборд-парков России: города, цены, обучение, инфраструктура, отзывы и маршруты.
          </p>
          <div className="mt-5">
            <ThemeSelector />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:justify-self-end">
          <nav aria-label="Основная навигация в подвале" className="grid gap-3 text-sm">
            <p className="font-semibold text-white">Разделы</p>
            {staticFooterLinks.map((item) => (
              <Link className="text-white/70 hover:text-white hover:underline" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          {navItems.length ? (
            <nav aria-label="CMS-навигация в подвале" className="grid gap-3 text-sm">
              <p className="font-semibold text-white">Дополнительно</p>
              {navItems.map(({ link }, i) => {
                return <CMSLink className="text-white/70 hover:text-white" key={i} {...link} />
              })}
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
