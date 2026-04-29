import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Тип первого экрана',
      options: [
        {
          label: 'Без первого экрана',
          value: 'none',
        },
        {
          label: 'Большой первый экран',
          value: 'highImpact',
        },
        {
          label: 'Средний первый экран',
          value: 'mediumImpact',
        },
        {
          label: 'Компактный первый экран',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Текст первого экрана',
    },
    linkGroup({
      overrides: {
        label: 'Кнопки первого экрана',
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      label: 'Изображение первого экрана',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
