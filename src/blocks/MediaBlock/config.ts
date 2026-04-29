import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      label: 'Медиафайл',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
  labels: {
    plural: 'Медиа-блоки',
    singular: 'Медиа-блок',
  },
}
