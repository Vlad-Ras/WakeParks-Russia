import clsx from 'clsx'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = ({ className }: Props) => {
  return (
    <span className={clsx('inline-flex items-center gap-2 font-semibold tracking-tight', className)}>
      <span className="flex size-9 items-center justify-center rounded-2xl bg-cyan-500 text-sm font-black text-white">
        W
      </span>
      <span className="leading-tight">
        <span className="block text-base">Wake Parks</span>
        <span className="block text-xs text-muted-foreground">Russia</span>
      </span>
    </span>
  )
}
