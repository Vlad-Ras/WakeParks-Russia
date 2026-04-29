import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from 'payload'

export const Cities: CollectionConfig = {
  slug: 'cities',
  labels: {
    singular: 'Город',
    plural: 'Города',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'region', 'isPopular', 'updatedAt'],
    group: 'Wake каталог',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Название города',
      type: 'text',
      required: true,
    },
    slugField({
      position: 'sidebar',
    }),
    {
      name: 'region',
      label: 'Регион / область',
      type: 'text',
      admin: {
        placeholder: 'Московская область, Татарстан, Краснодарский край...',
      },
    },
    {
      name: 'summary',
      label: 'Краткое описание',
      type: 'textarea',
      admin: {
        description: 'Выводится на карточке города и в SEO-блоках.',
      },
    },
    {
      name: 'coverImage',
      label: 'Изображение карточки/обложка города',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Показывается на карточках города и в верхнем блоке страницы города.',
      },
    },
    {
      name: 'imageSettings',
      label: 'Настройки изображения',
      type: 'group',
      admin: {
        description: 'Управляет тем, как изображение города отображается в карточках.',
      },
      fields: [
        {
          name: 'cardImagePlacement',
          label: 'Расположение в карточке',
          type: 'select',
          defaultValue: 'top',
          options: [
            { label: 'Сверху', value: 'top' },
            { label: 'Слева', value: 'left' },
            { label: 'Справа', value: 'right' },
            { label: 'Фоном', value: 'background' },
          ],
        },
        {
          name: 'objectPosition',
          label: 'Фокус изображения',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'По центру', value: 'center' },
            { label: 'Сверху', value: 'top' },
            { label: 'Снизу', value: 'bottom' },
            { label: 'Слева', value: 'left' },
            { label: 'Справа', value: 'right' },
          ],
        },
      ],
    },
    {
      name: 'coordinates',
      label: 'Координаты центра города',
      type: 'group',
      fields: [
        {
          name: 'lat',
          label: 'Широта',
          type: 'number',
        },
        {
          name: 'lng',
          label: 'Долгота',
          type: 'number',
        },
      ],
    },
    {
      name: 'isPopular',
      label: 'Популярный город',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      label: 'Порядок сортировки',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'SEO title',
          type: 'text',
        },
        {
          name: 'description',
          label: 'SEO description',
          type: 'textarea',
        },
      ],
    },
  ],
}
