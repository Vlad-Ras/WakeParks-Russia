import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { slugField } from 'payload'

export const Parks: CollectionConfig = {
  slug: 'parks',
  labels: {
    singular: 'Вейк-парк',
    plural: 'Вейк-парки',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        or: [
          { status: { equals: 'published' } },
          { published: { equals: true } },
        ],
      }
    },
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'city', 'status', 'priceFrom', 'isVerified', 'isFeatured', 'updatedAt'],
    group: 'Wake каталог',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Название парка',
      type: 'text',
      required: true,
    },
    slugField({
      position: 'sidebar',
    }),
    {
      name: 'city',
      label: 'Город',
      type: 'relationship',
      relationTo: 'cities',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Статус публикации',
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
        description: 'Публичная форма добавления создаёт парк со статусом «На модерации».',
        position: 'sidebar',
      },
    },
    {
      name: 'summary',
      label: 'Краткое описание',
      type: 'textarea',
      required: true,
    },
    {
      name: 'description',
      label: 'Полное описание',
      type: 'textarea',
    },
    {
      name: 'cardImage',
      label: 'Главное изображение карточки',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Показывается в карточке парка и в верхнем блоке страницы. Если пусто — будет использовано первое фото из галереи.',
      },
    },
    {
      name: 'imageSettings',
      label: 'Настройки изображения',
      type: 'group',
      admin: {
        description: 'Управляет тем, как главное изображение отображается в карточке.',
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
      name: 'gallery',
      label: 'Галерея фотографий',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Показывается на странице парка. Первое фото можно использовать как fallback для карточки.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'priceFrom',
          label: 'Цена от, ₽',
          type: 'number',
          min: 0,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'rating',
          label: 'Рейтинг',
          type: 'number',
          min: 0,
          max: 5,
          admin: {
            description: 'Например: 4.8',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'cableTypes',
      label: 'Типы катания',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Кольцевая канатка', value: 'ringCable' },
        { label: 'Реверсивная канатка', value: 'reverseCable' },
        { label: 'Катерный вейк', value: 'boatWake' },
        { label: 'Лебёдка', value: 'winch' },
      ],
    },
    {
      name: 'features',
      label: 'Услуги и инфраструктура',
      type: 'group',
      fields: [
        { name: 'training', label: 'Обучение', type: 'checkbox' },
        { name: 'equipmentRent', label: 'Аренда оборудования', type: 'checkbox' },
        { name: 'kidsSchool', label: 'Детская школа', type: 'checkbox' },
        { name: 'supRent', label: 'SUP', type: 'checkbox' },
        { name: 'cafe', label: 'Кафе', type: 'checkbox' },
        { name: 'shower', label: 'Душ', type: 'checkbox' },
        { name: 'changingRoom', label: 'Раздевалка', type: 'checkbox' },
        { name: 'parking', label: 'Парковка', type: 'checkbox' },
        { name: 'beach', label: 'Пляж / зона отдыха', type: 'checkbox' },
      ],
    },
    {
      name: 'prices',
      label: 'Старые встроенные цены',
      type: 'array',
      admin: {
        description: 'Оставлено как fallback для старых карточек. Для нового прайса лучше использовать отдельный раздел «Wake каталог → Цены».',
      },
      fields: [
        {
          name: 'title',
          label: 'Услуга',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Описание',
          type: 'text',
        },
        {
          name: 'price',
          label: 'Цена, ₽',
          type: 'number',
        },
        {
          name: 'duration',
          label: 'Длительность',
          type: 'text',
          admin: {
            placeholder: '10 минут, 1 час, день...',
          },
        },
      ],
    },
    {
      name: 'contacts',
      label: 'Контакты',
      type: 'group',
      fields: [
        { name: 'phone', label: 'Телефон', type: 'text' },
        { name: 'website', label: 'Сайт', type: 'text' },
        { name: 'vk', label: 'VK', type: 'text' },
        { name: 'telegram', label: 'Telegram', type: 'text' },
      ],
    },
    {
      name: 'location',
      label: 'Локация',
      type: 'group',
      fields: [
        { name: 'address', label: 'Адрес', type: 'text' },
        { name: 'district', label: 'Район / ориентир', type: 'text' },
        { name: 'yandexMapsUrl', label: 'Ссылка на Яндекс.Карты', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'lat', label: 'Широта', type: 'number', admin: { width: '50%' } },
            { name: 'lng', label: 'Долгота', type: 'number', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'workTime',
          label: 'График работы',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'season',
          label: 'Сезон',
          type: 'text',
          admin: {
            placeholder: 'Май–сентябрь / круглый год',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'submission',
      label: 'Данные публичной заявки',
      type: 'group',
      admin: {
        description: 'Заполняется автоматически, если парк добавлен через публичную форму.',
      },
      fields: [
        { name: 'submitterName', label: 'Имя отправителя', type: 'text' },
        { name: 'submitterPhone', label: 'Телефон отправителя', type: 'text' },
        { name: 'submitterEmail', label: 'Email отправителя', type: 'email' },
        { name: 'comment', label: 'Комментарий', type: 'textarea' },
      ],
    },
    {
      name: 'isVerified',
      label: 'Проверенный парк',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      label: 'Показывать в подборках',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isClaimed',
      label: 'Карточка подтверждена владельцем',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Ставится после проверки заявки владельца. Показывает бейдж доверия на сайте.',
        position: 'sidebar',
      },
    },
    {
      name: 'dataQuality',
      label: 'Актуальность данных',
      type: 'group',
      admin: {
        description: 'Используется для публичного блока «Данные карточки» и внутреннего контроля обновлений.',
      },
      fields: [
        {
          name: 'lastCheckedAt',
          label: 'Дата последней проверки',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'sourceUrl',
          label: 'Источник проверки',
          type: 'text',
          admin: {
            placeholder: 'Сайт парка, VK, Яндекс.Карты, 2ГИС...',
          },
        },
        {
          name: 'freshnessNote',
          label: 'Комментарий по актуальности',
          type: 'textarea',
          admin: {
            description: 'Например: «Прайс сверяли по VK», «График уточнить перед сезоном».',
          },
        },
        {
          name: 'updatePriority',
          label: 'Приоритет перепроверки',
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: 'Низкий', value: 'low' },
            { label: 'Обычный', value: 'normal' },
            { label: 'Высокий', value: 'high' },
          ],
        },
      ],
    },
    {
      name: 'published',
      label: 'Опубликовано (старое поле)',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Оставлено для совместимости с первой версией. Основное поле теперь — «Статус публикации».',
        position: 'sidebar',
      },
    },
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'title', label: 'SEO title', type: 'text' },
        { name: 'description', label: 'SEO description', type: 'textarea' },
      ],
    },
  ],
}
