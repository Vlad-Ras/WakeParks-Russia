import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Категория',
    plural: 'Категории',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: '2. Контент сайта',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Название',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
