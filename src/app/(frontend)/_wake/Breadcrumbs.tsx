import Link from 'next/link'

export type BreadcrumbItem = {
  href?: string
  label: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) return null

  return (
    <nav aria-label="Хлебные крошки" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link className="hover:text-foreground hover:underline" href="/">
            Главная
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
              <span aria-hidden="true">/</span>
              {item.href && !isLast ? (
                <Link className="hover:text-foreground hover:underline" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
