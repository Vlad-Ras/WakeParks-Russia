import type { GlobalConfig } from 'payload'

export const MapSettings: GlobalConfig = {
  slug: 'map-settings',
  label: 'Настройки карт',
  access: {
    read: () => true,
  },
  admin: {
    group: '4. Система',
    description: 'Ключи и режим отображения карт на публичных страницах сайта.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              name: 'provider',
              label: 'Режим карты',
              type: 'select',
              defaultValue: 'schema',
              required: true,
              options: [
                {
                  label: 'Схема без API-ключа',
                  value: 'schema',
                },
                {
                  label: 'Яндекс.Карты JavaScript API',
                  value: 'yandex-js-api',
                },
              ],
              admin: {
                description:
                  'Для локального MVP можно оставить схему без ключа. Если хочешь настоящую Яндекс.Карту с маркерами, выбери JavaScript API и заполни ключ ниже.',
              },
            },
            {
              name: 'yandexApiKey',
              label: 'API-ключ Яндекс.Карт',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.provider === 'yandex-js-api',
                description:
                  'Ключ из кабинета разработчика Яндекс.Карт. Не путать со ссылкой на маршрут — это именно ключ JavaScript API.',
              },
            },
            {
              name: 'showYandexEmbedFallback',
              label: 'Показывать встроенную карту выбранного парка ниже основной карты',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description:
                  'Встроенная карта по координатам работает без API-ключа. Её можно оставить как запасной вариант.',
              },
            },
          ],
        },
        {
          label: 'Центр и масштаб',
          fields: [
            {
              name: 'defaultCenter',
              label: 'Центр карты по умолчанию',
              type: 'group',
              fields: [
                {
                  name: 'lat',
                  label: 'Широта',
                  type: 'number',
                  defaultValue: 55.751244,
                  admin: {
                    description: 'Например, Москва: 55.751244',
                    step: 0.000001,
                  },
                },
                {
                  name: 'lng',
                  label: 'Долгота',
                  type: 'number',
                  defaultValue: 37.618423,
                  admin: {
                    description: 'Например, Москва: 37.618423',
                    step: 0.000001,
                  },
                },
              ],
            },
            {
              name: 'defaultZoom',
              label: 'Масштаб по умолчанию',
              type: 'number',
              defaultValue: 5,
              min: 1,
              max: 18,
              admin: {
                description: 'Для карты России обычно удобно 4–5. Для одного города — 10–12.',
              },
            },
          ],
        },
        {
          label: 'Подсказка',
          fields: [
            {
              name: 'adminNote',
              label: 'Памятка',
              type: 'textarea',
              defaultValue:
                'Чтобы парк появился на карте, в карточке парка заполни широту и долготу. Чтобы кнопка маршрута работала красиво, добавь ссылку на Яндекс.Карты.',
              admin: {
                description: 'Техническая заметка для администраторов. На сайте не показывается.',
              },
            },
          ],
        },
      ],
    },
  ],
}
