import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const columnFields: Field[] = [
  {
    name: 'size',
    label: 'Ширина колонки',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'Одна треть',
        value: 'oneThird',
      },
      {
        label: 'Половина',
        value: 'half',
      },
      {
        label: 'Две трети',
        value: 'twoThirds',
      },
      {
        label: 'На всю ширину',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    label: 'Текст колонки',
  },
  {
    name: 'enableLink',
    label: 'Добавить ссылку',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      label: 'Колонки',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
  labels: {
    plural: 'Контентные блоки',
    singular: 'Контентный блок',
  },
}
