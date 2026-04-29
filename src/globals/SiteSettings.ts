import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
  },
  admin: {
    group: '4. Система',
    description: 'Общие настройки проекта, контакты, формы, каталог и правила модерации.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              name: 'projectName',
              label: 'Название проекта',
              type: 'text',
              defaultValue: 'Wake Parks Russia',
              required: true,
              admin: {
                description: 'Используется в подвале, служебных блоках и как fallback для SEO.',
              },
            },
            {
              name: 'tagline',
              label: 'Короткое описание проекта',
              type: 'textarea',
              defaultValue:
                'Каталог вейкборд-парков России: города, цены, обучение, инфраструктура, отзывы и маршруты.',
              admin: {
                description: 'Выводится в подвале и на информационных страницах, если нет отдельного текста.',
              },
            },
            {
              name: 'adminChecklist',
              label: 'Памятка администратору',
              type: 'textarea',
              defaultValue:
                'Перед публикацией парка проверь город, статус, главное фото или галерею, координаты, ссылку на маршрут, цену от, услуги, контакты и SEO-описание.',
              admin: {
                description: 'Внутренняя подсказка. На публичном сайте не используется.',
              },
            },
          ],
        },
        {
          label: 'Контакты проекта',
          fields: [
            {
              name: 'contacts',
              label: 'Контакты',
              type: 'group',
              fields: [
                {
                  name: 'publicEmail',
                  label: 'Публичный email',
                  type: 'email',
                  admin: {
                    placeholder: 'info@example.ru',
                    description: 'Показывается на странице контактов и в подвале, если заполнен.',
                  },
                },
                {
                  name: 'phone',
                  label: 'Телефон проекта',
                  type: 'text',
                  admin: {
                    placeholder: '+7 900 000-00-00',
                  },
                },
                {
                  name: 'telegram',
                  label: 'Telegram проекта',
                  type: 'text',
                  admin: {
                    placeholder: 'https://t.me/... или @username',
                  },
                },
                {
                  name: 'vk',
                  label: 'VK проекта',
                  type: 'text',
                  admin: {
                    placeholder: 'https://vk.com/...',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Каталог',
          fields: [
            {
              name: 'catalog',
              label: 'Настройки каталога',
              type: 'group',
              fields: [
                {
                  name: 'showEmptyCities',
                  label: 'Показывать города без опубликованных парков',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Если выключить, пустые города исчезнут из публичного списка городов.',
                  },
                },
                {
                  name: 'citySort',
                  label: 'Сортировка городов по умолчанию',
                  type: 'select',
                  defaultValue: 'parksCount',
                  options: [
                    { label: 'Сначала города с большим числом парков', value: 'parksCount' },
                    { label: 'По алфавиту', value: 'alphabet' },
                    { label: 'Ручной порядок sortOrder', value: 'manual' },
                  ],
                },
                {
                  name: 'parkSort',
                  label: 'Сортировка парков по умолчанию',
                  type: 'select',
                  defaultValue: 'featured',
                  options: [
                    { label: 'Сначала рекомендуемые', value: 'featured' },
                    { label: 'Сначала высокий рейтинг', value: 'ratingDesc' },
                    { label: 'Сначала дешевле', value: 'priceAsc' },
                    { label: 'Сначала дороже', value: 'priceDesc' },
                    { label: 'По названию', value: 'titleAsc' },
                  ],
                },
                {
                  name: 'showDataQuality',
                  label: 'Показывать дату проверки данных',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Управляет публичным выводом блока актуальности данных в карточках.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Формы и модерация',
          fields: [
            {
              name: 'forms',
              label: 'Публичные формы',
              type: 'group',
              fields: [
                {
                  type: 'collapsible',
                  label: 'Включение форм',
                  admin: { initCollapsed: false },
                  fields: [
                    { name: 'contactFormEnabled', label: 'Форма контактов включена', type: 'checkbox', defaultValue: true },
                    { name: 'addParkFormEnabled', label: 'Форма добавления парка включена', type: 'checkbox', defaultValue: true },
                    { name: 'reviewFormEnabled', label: 'Форма отзывов включена', type: 'checkbox', defaultValue: true },
                    { name: 'reportFormEnabled', label: 'Форма сообщения об ошибке включена', type: 'checkbox', defaultValue: true },
                    { name: 'claimFormEnabled', label: 'Форма подтверждения владельца включена', type: 'checkbox', defaultValue: true },
                    { name: 'honeypotEnabled', label: 'Honeypot-защита от простого спама', type: 'checkbox', defaultValue: true },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Статусы новых данных',
                  admin: { initCollapsed: false },
                  fields: [
                    {
                      name: 'newParkStatus',
                      label: 'Статус нового парка из публичной формы',
                      type: 'select',
                      defaultValue: 'pending',
                      options: [
                        { label: 'Черновик', value: 'draft' },
                        { label: 'На модерации', value: 'pending' },
                      ],
                    },
                    {
                      name: 'newPriceStatus',
                      label: 'Статус новых цен из публичной формы',
                      type: 'select',
                      defaultValue: 'pending',
                      options: [
                        { label: 'Черновик', value: 'draft' },
                        { label: 'На модерации', value: 'pending' },
                      ],
                    },
                    {
                      name: 'newReviewStatus',
                      label: 'Статус нового отзыва',
                      type: 'select',
                      defaultValue: 'pending',
                      options: [
                        { label: 'На модерации', value: 'pending' },
                        { label: 'Опубликовано сразу', value: 'published' },
                      ],
                    },
                  ],
                },
                {
                  name: 'moderationNote',
                  label: 'Инструкция по модерации',
                  type: 'textarea',
                  defaultValue:
                    'Новые парки, отзывы, правки и заявки владельцев не стоит публиковать без проверки контактов, адреса, цен, фотографий и источника данных.',
                  admin: {
                    description: 'Внутренняя заметка для редакторов.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO по умолчанию',
          fields: [
            {
              name: 'seoDefaults',
              label: 'Fallback SEO',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  label: 'SEO title по умолчанию',
                  type: 'text',
                  defaultValue: 'Wake Parks Russia — вейк-парки России',
                },
                {
                  name: 'description',
                  label: 'SEO description по умолчанию',
                  type: 'textarea',
                  defaultValue:
                    'Каталог вейкборд-парков России по городам: цены, обучение, инфраструктура, контакты, отзывы и маршруты.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
