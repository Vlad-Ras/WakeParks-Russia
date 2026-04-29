import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Шапка сайта',
  access: {
    read: () => true,
  },
  admin: {
    group: '4. Система',
    description: 'Дополнительные пункты меню в шапке. Основные пункты каталога уже добавлены в коде сайта.',
  },
  fields: [
    {
      name: 'navItems',
      label: 'Дополнительные пункты меню',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        description: 'Используй для временных или служебных ссылок. Основные разделы уже сгруппированы в шапке.',
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
