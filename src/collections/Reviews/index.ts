import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Отзыв',
    plural: 'Отзывы',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
    update: authenticated,
  },
  admin: {
    defaultColumns: ['park', 'authorName', 'rating', 'status', 'createdAt'],
    group: 'Wake каталог',
    useAsTitle: 'authorName',
  },
  fields: [
    {
      name: 'park',
      label: 'Парк',
      type: 'relationship',
      relationTo: 'parks',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'На модерации', value: 'pending' },
        { label: 'Опубликован', value: 'published' },
        { label: 'Отклонён', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'authorName',
      label: 'Имя автора',
      type: 'text',
      required: true,
    },
    {
      name: 'rating',
      label: 'Оценка',
      type: 'number',
      min: 1,
      max: 5,
      required: true,
      admin: {
        description: 'Число от 1 до 5.',
      },
    },
    {
      name: 'text',
      label: 'Текст отзыва',
      type: 'textarea',
      required: true,
    },
    {
      name: 'visitedAt',
      label: 'Дата посещения',
      type: 'date',
      admin: {
        description: 'Можно оставить пустым, если дата неизвестна.',
      },
    },
    {
      name: 'source',
      label: 'Источник',
      type: 'select',
      defaultValue: 'site',
      options: [
        { label: 'Форма сайта', value: 'site' },
        { label: 'VK', value: 'vk' },
        { label: 'Яндекс.Карты', value: 'yandex' },
        { label: '2ГИС', value: '2gis' },
        { label: 'Администратор', value: 'admin' },
      ],
    },
    {
      name: 'contactEmail',
      label: 'Email автора',
      type: 'email',
      access: { read: authenticated },
      admin: {
        description: 'Не выводится публично. Нужен только для связи при модерации.',
      },
    },
    {
      name: 'isFeatured',
      label: 'Выделить отзыв',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
