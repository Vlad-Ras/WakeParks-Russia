import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const ParkReports: CollectionConfig = {
  slug: 'park-reports',
  labels: {
    singular: 'Правка по парку',
    plural: 'Правки по паркам',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['park', 'type', 'status', 'authorName', 'createdAt'],
    group: 'Wake каталог',
    useAsTitle: 'message',
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
      label: 'Статус обработки',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В работе', value: 'inProgress' },
        { label: 'Исправлено', value: 'resolved' },
        { label: 'Отклонено', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      label: 'Что исправить',
      type: 'select',
      defaultValue: 'other',
      required: true,
      options: [
        { label: 'Цена', value: 'price' },
        { label: 'Контакты', value: 'contacts' },
        { label: 'Адрес / карта', value: 'location' },
        { label: 'График работы', value: 'schedule' },
        { label: 'Услуги / инфраструктура', value: 'features' },
        { label: 'Парк закрыт', value: 'closed' },
        { label: 'Дубль карточки', value: 'duplicate' },
        { label: 'Другое', value: 'other' },
      ],
    },
    {
      name: 'message',
      label: 'Описание правки',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Что именно неактуально и на что нужно заменить.',
      },
    },
    {
      name: 'sourceUrl',
      label: 'Источник / ссылка на подтверждение',
      type: 'text',
      admin: {
        placeholder: 'Сайт парка, VK, Яндекс.Карты, пост с актуальным прайсом...',
      },
    },
    {
      name: 'authorName',
      label: 'Имя отправителя',
      type: 'text',
    },
    {
      name: 'contactEmail',
      label: 'Email отправителя',
      type: 'email',
      admin: {
        description: 'Не выводится публично. Нужен только для связи при модерации.',
      },
    },
  ],
}
