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
              label: 'Название города',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Москва, Казань, Сочи...',
                description: 'Название выводится в карточках, хлебных крошках, фильтрах и заголовках страниц.',
              },
            },
            {
              name: 'region',
              label: 'Регион / область',
              type: 'text',
              admin: {
                placeholder: 'Московская область, Татарстан, Краснодарский край...',
                description: 'Используется для страницы регионов и группировки городов.',
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
          ],
        },
        {
          label: 'Медиа',
          fields: [
            {
              name: 'coverImage',
              label: 'Изображение карточки / обложка города',
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
          ],
        },
        {
          label: 'Карта и SEO',
          fields: [
            {
              name: 'coordinates',
              label: 'Координаты центра города',
              type: 'group',
              admin: {
                description: 'Нужны для будущей карты городов и регионов.',
              },
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
              name: 'meta',
              label: 'SEO',
              type: 'group',
              admin: {
                description: 'Если оставить пустым, сайт использует автоматический заголовок и описание.',
              },
              fields: [
                {
                  name: 'title',
                  label: 'SEO title',
                  type: 'text',
                  admin: { placeholder: 'Вейк-парки Москвы — цены, адреса, обучение' },
                },
                {
                  name: 'description',
                  label: 'SEO description',
                  type: 'textarea',
                },
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
      name: 'isPopular',
      label: 'Популярный город',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Поднимает город в блоках на главной и в списке городов.',
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      label: 'Порядок сортировки',
      type: 'number',
      defaultValue: 100,
      admin: {
        description: 'Чем меньше число, тем выше город в ручной сортировке.',
        position: 'sidebar',
      },
    },
  ],
}
