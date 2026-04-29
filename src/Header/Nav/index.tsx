'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

const staticNavItems = [
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
  { href: '/favorites', label: 'Избранное' },
  { href: '/compare', label: 'Сравнение' },
  { href: '/for-parks', label: 'Для парков' },
  { href: '/owner-guide', label: 'Гайд владельца' },
  { href: '/advertising', label: 'Реклама' },
  { href: '/about', label: 'О проекте' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/update-park', label: 'Обновить данные' },
  { href: '/add-park', label: 'Добавить парк' },
]

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex flex-wrap items-center justify-end gap-3 text-sm font-medium">
      {staticNavItems.map((item) => (
        <Link className="rounded-full px-3 py-2 hover:bg-secondary" href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link className="rounded-full p-2 hover:bg-secondary" href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
