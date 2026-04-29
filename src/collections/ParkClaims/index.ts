import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const ParkClaims: CollectionConfig = {
  slug: 'park-claims',
  labels: {
    singular: 'Заявка владельца',
    plural: 'Заявки владельцев',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['park', 'claimType', 'status', 'contactName', 'preferredContact', 'createdAt'],
    group: 'Wake каталог',
    useAsTitle: 'contactName',
  },
  fields: [
    {
      name: 'park',
      label: 'Парк',
      type: 'relationship',
      relationTo: 'parks',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      label: 'Статус обработки',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'Проверяем', value: 'checking' },
        { label: 'Подтверждена', value: 'approved' },
        { label: 'Отклонена', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'claimType',
      label: 'Тип заявки',
      type: 'select',
      defaultValue: 'owner',
      required: true,
      options: [
        { label: 'Я владелец парка', value: 'owner' },
        { label: 'Я управляющий / администратор', value: 'manager' },
        { label: 'Официальный представитель', value: 'representative' },
        { label: 'Хочу обновлять карточку', value: 'updateAccess' },
        { label: 'Партнёрство / продвижение', value: 'partnership' },
        { label: 'Другое', value: 'other' },
      ],
    },
    {
      name: 'requestedActions',
      label: 'Что нужно сделать с карточкой',
      type: 'select',
      hasMany: true,
      defaultValue: ['claimCard'],
      options: [
        { label: 'Подтвердить карточку владельцем', value: 'claimCard' },
        { label: 'Обновить контакты', value: 'updateContacts' },
        { label: 'Обновить цены', value: 'updatePrices' },
        { label: 'Добавить / заменить фото', value: 'updatePhotos' },
        { label: 'Обновить график и сезон', value: 'updateSchedule' },
        { label: 'Обсудить продвижение', value: 'addPromotion' },
      ],
      admin: {
        description: 'Заполняется публичной формой. Помогает быстро понять, что именно ждёт владелец.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'contactName', label: 'Контактное лицо', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'companyName', label: 'Компания / юрлицо', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'role', label: 'Роль в парке', type: 'text', admin: { width: '50%', placeholder: 'Владелец, управляющий, маркетолог...' } },
        {
          name: 'preferredContact',
          label: 'Предпочтительный способ связи',
          type: 'select',
          defaultValue: 'telegram',
          admin: { width: '50%' },
          options: [
            { label: 'Telegram', value: 'telegram' },
            { label: 'Телефон', value: 'phone' },
            { label: 'Email', value: 'email' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', label: 'Телефон', type: 'text', admin: { width: '33%' } },
        { name: 'telegram', label: 'Telegram', type: 'text', admin: { width: '33%' } },
        { name: 'email', label: 'Email', type: 'email', admin: { width: '33%' } },
      ],
    },
    {
      name: 'proofUrl',
      label: 'Ссылка на подтверждение',
      type: 'text',
      admin: {
        description: 'Сайт парка, VK, Яндекс.Карты, 2ГИС или другой источник, где видно связь заявителя с парком.',
      },
    },
    {
      name: 'proofUrl2',
      label: 'Дополнительная ссылка',
      type: 'text',
      admin: {
        description: 'Дополнительный источник: второй сайт, соцсеть, пост с прайсом, карточка в картах.',
      },
    },
    {
      name: 'message',
      label: 'Комментарий',
      type: 'textarea',
      admin: {
        description: 'Что нужно сделать: подтвердить карточку, обновить данные, обсудить продвижение, передать доступ и т.д.',
      },
    },
    {
      name: 'privacyConsent',
      label: 'Согласие на обработку ПДн получено',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'adminChecklist',
      label: 'Чеклист проверки заявки',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'contactChecked', label: 'Контакт проверен', type: 'checkbox' },
        { name: 'sourceChecked', label: 'Источник подтверждения проверен', type: 'checkbox' },
        { name: 'parkUpdated', label: 'Карточка обновлена', type: 'checkbox' },
        { name: 'claimBadgeEnabled', label: 'Бейдж владельца включён', type: 'checkbox' },
      ],
    },
    {
      name: 'adminNote',
      label: 'Внутренняя заметка администратора',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
  ],
}
