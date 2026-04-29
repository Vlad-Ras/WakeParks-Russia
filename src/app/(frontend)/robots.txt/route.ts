import { getServerSideURL } from '@/utilities/getURL'

export function GET() {
  const baseUrl = trimSlash(process.env.NEXT_PUBLIC_SITE_URL || getServerSideURL() || 'http://localhost:3000')

  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /actions\nDisallow: /data-tools\n\nSitemap: ${baseUrl}/sitemap.xml\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

function trimSlash(value: string) {
  return value.replace(/\/$/, '')
}
