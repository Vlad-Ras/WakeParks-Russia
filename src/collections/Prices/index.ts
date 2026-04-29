import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Prices: CollectionConfig = {
  slug: 'prices',
  labels: {
    singular: 'Цена',
    plural: 'Цены',
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
    defaultColumns: ['title', 'park', 'category', 'price', 'duration', 'status', 'sortOrder'],
    group: 'Wake каталог',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Название услуги',
      type: 'text',
      required: true,
      admin: {
        placeholder: '1 сет 10 минут, обучение с инструктором, SUP 1 час...',
      },
    },
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
      defaultValue: 'published',
      required: true,
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'На модерации', value: 'pending' },
        { label: 'Опубликовано', value: 'published' },
        { label: 'В архиве', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      label: 'Категория цены',
      type: 'select',
      defaultValue: 'wake',
      required: true,
      options: [
        { label: 'Вейкборд / сеты', value: 'wake' },
        { label: 'Обучение', value: 'training' },
        { label: 'Аренда оборудования', value: 'rent' },
        { label: 'SUP и вода', value: 'sup' },
        { label: 'Абонементы / пакеты', value: 'package' },
        { label: 'Прочее', value: 'other' },
      ],
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
      admin: {
        placeholder: 'Что входит, ограничения, условия в будни/выходные...',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          label: 'Основная цена, ₽',
          type: 'number',
          min: 0,
          admin: { width: '33%' },
        },
        {
          name: 'weekdayPrice',
          label: 'Будни, ₽',
          type: 'number',
          min: 0,
          admin: { width: '33%' },
        },
        {
          name: 'weekendPrice',
          label: 'Выходные, ₽',
          type: 'number',
          min: 0,
          admin: { width: '33%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'duration',
          label: 'Длительность / единица',
          type: 'text',
          admin: {
            placeholder: '10 минут, 1 час, день, пакет 5 сетов...',
            width: '50%',
          },
        },
        {
          name: 'sortOrder',
          label: 'Порядок вывода',
          type: 'number',
          defaultValue: 100,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'sourceNote',
      label: 'Источник / примечание для администратора',
      type: 'textarea',
      admin: {
        description: 'Не обязательно. Можно указать, откуда взята цена или что нужно проверить.',
      },
    },
  ],
}
