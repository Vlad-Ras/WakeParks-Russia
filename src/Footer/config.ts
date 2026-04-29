import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Подвал сайта',
  access: {
    read: () => true,
  },
  admin: {
    group: '4. Система',
    description: 'Дополнительные ссылки в нижней части сайта. Основные группы подвала уже собраны в коде.',
  },
  fields: [
    {
      name: 'navItems',
      label: 'Дополнительные ссылки подвала',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        description: 'Например: партнёрские страницы, служебные документы или временные акции.',
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
