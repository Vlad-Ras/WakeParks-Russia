'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['navItems']>[number]>()

  const label = data?.data?.link?.label
    ? `Пункт меню ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.link.label}`
    : 'Пункт меню'

  return <div>{label}</div>
}
