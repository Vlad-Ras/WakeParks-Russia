import { redirect } from 'next/navigation'

type Args = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ClaimParkRedirect({ searchParams: searchParamsPromise }: Args) {
  const searchParams = (await searchParamsPromise) || {}
  const park = Array.isArray(searchParams.park) ? searchParams.park[0] : searchParams.park

  redirect(park ? `/for-parks?park=${encodeURIComponent(park)}` : '/for-parks')
}
