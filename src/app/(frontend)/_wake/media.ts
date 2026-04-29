export type MediaDoc = {
  alt?: string | null
  url?: string | null
  filename?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null } | undefined> | null
}

export type ImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right'
export type CardImagePlacement = 'top' | 'left' | 'right' | 'background'

export function isMediaDoc(value: unknown): value is MediaDoc {
  return Boolean(value && typeof value === 'object')
}

export function getImageUrl(value: unknown, preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string | null {
  if (!isMediaDoc(value)) return null

  const fromSize = value.sizes?.[preferredSize]?.url
  const url = fromSize || value.url

  if (url) return normalizeMediaUrl(url)
  if (value.filename) return `/media/${value.filename}`

  return null
}

export function getImageAlt(value: unknown, fallback: string): string {
  if (!isMediaDoc(value)) return fallback
  return value.alt || fallback
}

export function getObjectPosition(position?: ImagePosition | string | null): string {
  switch (position) {
    case 'top':
      return 'object-top'
    case 'bottom':
      return 'object-bottom'
    case 'left':
      return 'object-left'
    case 'right':
      return 'object-right'
    case 'center':
    default:
      return 'object-center'
  }
}

function normalizeMediaUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url
  return `/${url}`
}
