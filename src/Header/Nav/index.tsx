'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ChevronDownIcon, MenuIcon, SearchIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

const primaryNavItems = [
  { href: '/wake-parks', label: 'Парки' },
  { href: '/cities', label: 'Города' },
  { href: '/map', label: 'Карта' },
  { href: '/pick', label: 'Подбор' },
]

const navGroups = [
  {
    label: 'Каталог',
    description: 'География, рейтинги и свежие карточки',
    links: [
      { href: '/regions', label: 'Регионы' },
      { href: '/best', label: 'Лучшие парки' },
      { href: '/new-parks', label: 'Новые парки' },
      { href: '/recently-updated', label: 'Недавно обновлено' },
    ],
  },
  {
    label: 'Подборки',
    description: 'Быстрые сценарии поиска площадки',
    links: [
      { href: '/training', label: 'Новичкам' },
      { href: '/kids', label: 'Детям' },
      { href: '/sup', label: 'SUP и отдых' },
      { href: '/cable-wake', label: 'Канатки' },
      { href: '/guides', label: 'Гайды' },
    ],
  },
  {
    label: 'Мои списки',
    description: 'Сохранение и сравнение вариантов',
    links: [
      { href: '/favorites', label: 'Избранное' },
      { href: '/compare', label: 'Сравнение' },
      { href: '/search', label: 'Поиск по сайту' },
    ],
  },
  {
    label: 'Для парков',
    description: 'Добавление, обновление и продвижение карточек',
    links: [
      { href: '/for-parks', label: 'Владельцам' },
      { href: '/owner-guide', label: 'Гайд владельца' },
      { href: '/update-park', label: 'Обновить данные' },
      { href: '/advertising', label: 'Реклама' },
    ],
  },
]

const supportLinks = [
  { href: '/about', label: 'О проекте' },
  { href: '/contacts', label: 'Контакты' },
]

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function navLinkClass(pathname: string, href: string) {
  const active = isActivePath(pathname, href)

  return [
    'rounded-full px-3 py-2 transition-colors',
    active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/75 hover:bg-secondary hover:text-foreground',
  ].join(' ')
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const pathname = usePathname()
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center justify-end gap-2 text-sm font-medium" aria-label="Основная навигация">
      <div className="hidden items-center gap-1 xl:flex">
        {primaryNavItems.map((item) => (
          <Link className={navLinkClass(pathname, item.href)} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}

        {navGroups.map((group) => (
          <div className="group relative" key={group.label}>
            <button
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground"
              type="button"
            >
              {group.label}
              <ChevronDownIcon className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-72 translate-y-2 rounded-3xl border border-border bg-card p-3 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-3 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-3 group-focus-within:opacity-100">
              <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {group.label}
              </p>
              <p className="px-3 pb-2 pt-1 text-xs leading-relaxed text-muted-foreground">{group.description}</p>
              <div className="grid gap-1">
                {group.links.map((item) => (
                  <Link
                    className={[
                      'rounded-2xl px-3 py-2 transition-colors',
                      isActivePath(pathname, item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/75 hover:bg-secondary hover:text-foreground',
                    ].join(' ')}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        {supportLinks.map((item) => (
          <Link className={navLinkClass(pathname, item.href)} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="hidden items-center gap-2 xl:flex">
        {navItems.map(({ link }, i) => {
          return <CMSLink className="text-foreground/75 hover:text-foreground" key={i} {...link} appearance="link" />
        })}

        <Link className="rounded-full p-2 text-foreground/75 transition-colors hover:bg-secondary hover:text-primary" href="/search">
          <span className="sr-only">Поиск</span>
          <SearchIcon className="h-5 w-5" />
        </Link>

        <Link
          className="rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          href="/add-park"
        >
          Добавить парк
        </Link>
      </div>

      <details className="group relative xl:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm [&::-webkit-details-marker]:hidden">
          <MenuIcon className="h-4 w-4" />
          Меню
        </summary>
        <div className="absolute right-0 top-full z-50 mt-3 max-h-[75vh] w-[min(92vw,360px)] overflow-auto rounded-3xl border border-border bg-card p-4 shadow-2xl">
          <div className="mb-4 grid grid-cols-2 gap-2">
            {primaryNavItems.map((item) => (
              <Link className={navLinkClass(pathname, item.href)} href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            className="mb-4 flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-sm"
            href="/add-park"
          >
            Добавить парк
          </Link>

          <div className="grid gap-4">
            {navGroups.map((group) => (
              <section className="rounded-2xl border border-border p-3" key={group.label}>
                <p className="text-sm font-semibold">{group.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{group.description}</p>
                <div className="mt-3 grid gap-1">
                  {group.links.map((item) => (
                    <Link
                      className={[
                        'rounded-xl px-3 py-2 text-sm transition-colors',
                        isActivePath(pathname, item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/75 hover:bg-secondary hover:text-foreground',
                      ].join(' ')}
                      href={item.href}
                      key={item.href}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
            {supportLinks.map((item) => (
              <Link className="rounded-xl px-3 py-2 text-sm text-foreground/75 hover:bg-secondary" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="rounded-xl px-3 py-2 text-sm text-foreground/75 hover:bg-secondary" href="/search">
              Поиск
            </Link>
          </div>
        </div>
      </details>
    </nav>
  )
}
