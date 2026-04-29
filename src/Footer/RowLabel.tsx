'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['navItems']>[number]>()

  const label = data?.data?.link?.label
    ? `Ссылка подвала ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.link.label}`
    : 'Ссылка подвала'

  return <div>{label}</div>
}
