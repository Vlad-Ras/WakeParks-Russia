import { getServerSideURL } from '@/utilities/getURL'

import { getCities, getCityFromPark, getParks } from '../_wake/queries'
import { buildRegionGroups } from '../_wake/regionUtils'
import { guides } from '../guides/data'

export async function GET() {
  const baseUrl = trimSlash(process.env.NEXT_PUBLIC_SITE_URL || getServerSideURL() || 'http://localhost:3000')
  const [cities, parks] = await Promise.all([getCities(), getParks(1000)])

  const urls = [
    url(baseUrl, '/', 'daily', '1.0'),
    url(baseUrl, '/cities', 'weekly', '0.9'),
    url(baseUrl, '/regions', 'weekly', '0.8'),
    url(baseUrl, '/wake-parks', 'weekly', '0.9'),
    url(baseUrl, '/best', 'weekly', '0.8'),
    url(baseUrl, '/new-parks', 'weekly', '0.7'),
    url(baseUrl, '/recently-updated', 'weekly', '0.7'),
    url(baseUrl, '/pick', 'weekly', '0.8'),
    url(baseUrl, '/training', 'weekly', '0.7'),
    url(baseUrl, '/kids', 'weekly', '0.7'),
    url(baseUrl, '/sup', 'weekly', '0.7'),
    url(baseUrl, '/cable-wake', 'weekly', '0.7'),
    url(baseUrl, '/map', 'weekly', '0.8'),
    url(baseUrl, '/guides', 'weekly', '0.7'),
    url(baseUrl, '/search', 'monthly', '0.4'),
    url(baseUrl, '/compare', 'monthly', '0.4'),
    url(baseUrl, '/add-park', 'monthly', '0.5'),
    url(baseUrl, '/for-parks', 'monthly', '0.5'),
    url(baseUrl, '/owner-guide', 'monthly', '0.5'),
    url(baseUrl, '/claim-success', 'yearly', '0.2'),
    url(baseUrl, '/advertising', 'monthly', '0.5'),
    url(baseUrl, '/about', 'monthly', '0.5'),
    url(baseUrl, '/contacts', 'monthly', '0.5'),
    url(baseUrl, '/privacy', 'yearly', '0.3'),
    url(baseUrl, '/terms', 'yearly', '0.3'),
    url(baseUrl, '/cookies', 'yearly', '0.3'),
    url(baseUrl, '/update-park', 'monthly', '0.5'),
    url(baseUrl, '/launch-checklist', 'monthly', '0.4'),
    ...buildRegionGroups(cities, parks).map((region) => url(baseUrl, '/regions/' + region.slug, 'weekly', '0.7')),
    ...guides.map((guide) => url(baseUrl, `/guides/${guide.slug}`, 'monthly', '0.7')),
    ...cities.filter((city) => city.slug).map((city) => url(baseUrl, `/wake-parks/${city.slug}`, 'weekly', '0.8')),
    ...parks
      .map((park) => {
        const city = getCityFromPark(park)
        if (!city?.slug || !park.slug) return null
        return url(baseUrl, `/wake-parks/${city.slug}/${park.slug}`, 'weekly', '0.8')
      })
      .filter(Boolean),
  ]

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}

function url(baseUrl: string, path: string, changefreq = 'weekly', priority = '0.7') {
  return `  <url><loc>${escapeXml(`${baseUrl}${path}`)}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
}

function trimSlash(value: string) {
  return value.replace(/\/$/, '')
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
