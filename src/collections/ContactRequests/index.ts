import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  labels: {
    singular: 'Обращение',
    plural: 'Обращения',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['subject', 'requestType', 'status', 'name', 'createdAt'],
    group: '3. Обратная связь',
    useAsTitle: 'subject',
  },
  fields: [
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'Новое', value: 'new' },
        { label: 'В работе', value: 'inProgress' },
        { label: 'Ждём ответа', value: 'waiting' },
        { label: 'Закрыто', value: 'closed' },
        { label: 'Спам', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'requestType',
      label: 'Тип обращения',
      type: 'select',
      defaultValue: 'general',
      required: true,
      options: [
        { label: 'Общий вопрос', value: 'general' },
        { label: 'Партнёрство', value: 'partnership' },
        { label: 'Вопрос по парку', value: 'park' },
        { label: 'Реклама / продвижение', value: 'ads' },
        { label: 'Ошибка на сайте', value: 'bug' },
        { label: 'Юридический вопрос', value: 'legal' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Имя', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'subject', label: 'Тема', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'Email', type: 'email', admin: { width: '33%' } },
        { name: 'phone', label: 'Телефон', type: 'text', admin: { width: '33%' } },
        { name: 'telegram', label: 'Telegram', type: 'text', admin: { width: '33%' } },
      ],
    },
    {
      name: 'message',
      label: 'Сообщение',
      type: 'textarea',
      required: true,
    },
    {
      name: 'sourcePage',
      label: 'Страница-источник',
      type: 'text',
      admin: {
        description: 'Заполняется автоматически, если форма передала адрес страницы.',
      },
    },
    {
      name: 'adminNote',
      label: 'Внутренняя заметка администратора',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
  ],
}
