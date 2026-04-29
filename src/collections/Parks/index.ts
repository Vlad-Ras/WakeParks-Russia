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
    defaultColumns: ['title', 'city', 'status', 'priceFrom', 'isVerified', 'isClaimed', 'updatedAt'],
    group: '1. Wake каталог',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              name: 'title',
              label: 'Название парка',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Например: Wake Park Sokolniki',
                description: 'Название должно совпадать с тем, как парк представлен на сайте или в картах.',
              },
            },
            {
              name: 'summary',
              label: 'Краткое описание',
              type: 'textarea',
              required: true,
              admin: {
                description: '2–3 предложения для карточки в каталоге. Не вставляй сюда весь текст о парке.',
              },
            },
            {
              name: 'description',
              label: 'Полное описание',
              type: 'textarea',
              admin: {
                description: 'Подробное описание для страницы парка: кому подходит, что есть на территории, чем парк выделяется.',
              },
            },
          ],
        },
        {
          label: 'Медиа',
          fields: [
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
          ],
        },
        {
          label: 'Услуги и цены',
          fields: [
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
                    description: 'Минимальная цена для карточек и сортировок. Подробные цены задаются отдельно.',
                  },
                },
                {
                  name: 'rating',
                  label: 'Рейтинг',
                  type: 'number',
                  min: 0,
                  max: 5,
                  admin: {
                    description: 'Например: 4.8. Используется в подборках и сравнении.',
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
              admin: {
                description: 'Можно выбрать несколько вариантов, если парк поддерживает разные форматы катания.',
              },
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
              admin: {
                description: 'Эти галочки используются в фильтрах, подборках и карточке парка.',
              },
              fields: [
                {
                  type: 'collapsible',
                  label: 'Катание и обучение',
                  admin: { initCollapsed: false },
                  fields: [
                    { name: 'training', label: 'Обучение', type: 'checkbox' },
                    { name: 'equipmentRent', label: 'Аренда оборудования', type: 'checkbox' },
                    { name: 'kidsSchool', label: 'Детская школа', type: 'checkbox' },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Вода и активности',
                  admin: { initCollapsed: true },
                  fields: [
                    { name: 'supRent', label: 'SUP', type: 'checkbox' },
                    { name: 'beach', label: 'Пляж / зона отдыха', type: 'checkbox' },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Инфраструктура',
                  admin: { initCollapsed: true },
                  fields: [
                    { name: 'cafe', label: 'Кафе', type: 'checkbox' },
                    { name: 'shower', label: 'Душ', type: 'checkbox' },
                    { name: 'changingRoom', label: 'Раздевалка', type: 'checkbox' },
                    { name: 'parking', label: 'Парковка', type: 'checkbox' },
                  ],
                },
              ],
            },
            {
              name: 'prices',
              label: 'Старые встроенные цены',
              type: 'array',
              admin: {
                description: 'Оставлено как fallback для старых карточек. Для нового прайса лучше использовать отдельный раздел «Wake каталог → Цены».',
                initCollapsed: true,
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
          ],
        },
        {
          label: 'Контакты и локация',
          fields: [
            {
              name: 'contacts',
              label: 'Контакты',
              type: 'group',
              fields: [
                { name: 'phone', label: 'Телефон', type: 'text', admin: { placeholder: '+7 900 000-00-00' } },
                { name: 'website', label: 'Сайт', type: 'text', admin: { placeholder: 'https://...' } },
                { name: 'vk', label: 'VK', type: 'text', admin: { placeholder: 'https://vk.com/...' } },
                { name: 'telegram', label: 'Telegram', type: 'text', admin: { placeholder: 'https://t.me/... или @username' } },
              ],
            },
            {
              name: 'location',
              label: 'Локация',
              type: 'group',
              admin: {
                description: 'Координаты нужны для карты и подборок по расположению.',
              },
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
                    placeholder: 'Пн–Пт 10:00–22:00, Сб–Вс 09:00–22:00',
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
          ],
        },
        {
          label: 'Модерация и заявки',
          fields: [
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
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              label: 'SEO',
              type: 'group',
              fields: [
                { name: 'title', label: 'SEO title', type: 'text', admin: { placeholder: 'Вейк-парк ... — цены, адрес, обучение' } },
                { name: 'description', label: 'SEO description', type: 'textarea' },
              ],
            },
          ],
        },
      ],
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
        description: 'Если парк не появляется на странице города, проверь этот выбор и статус публикации.',
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
        description: 'На сайте показываются только опубликованные карточки.',
        position: 'sidebar',
      },
    },
    {
      name: 'isVerified',
      label: 'Проверенный парк',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Внутренняя отметка качества данных.',
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      label: 'Показывать в подборках',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Поднимает парк в рекомендуемых и тематических списках.',
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
      name: 'published',
      label: 'Опубликовано (старое поле)',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Оставлено для совместимости с первой версией. Основное поле теперь — «Статус публикации».',
        position: 'sidebar',
      },
    },
  ],
}
