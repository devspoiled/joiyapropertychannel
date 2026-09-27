import { ListingsView } from '@/components/properties/listings-view'
import { getApiClient } from '@/lib/api'
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { twMerge } from 'tailwind-merge'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans'
})
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono'
})

const PAGE_SIZE = 30

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<{
    page?: string
    type?: string
    city?: string
    price_max?: string
    beds?: string
  }>
}) {
  const { page, type, city, price_max, beds } = await searchParams
  const pageNumber = Math.max(1, Number(page) || 1)

  const apiClient = await getApiClient()
  const propertiesPage = await apiClient.properties.propertiesList(
    beds ? Number(beds) : undefined,
    city || undefined,
    undefined,
    pageNumber,
    PAGE_SIZE,
    price_max ? Number(price_max) : undefined,
    undefined,
    type || undefined
  )

  const totalPages = Math.max(1, Math.ceil(propertiesPage.count / PAGE_SIZE))

  return (
    <div
      className={twMerge(sans.variable, mono.variable)}
      style={
        {
          '--font-sans-family': sans.style.fontFamily,
          '--font-mono-family': mono.style.fontFamily
        } as React.CSSProperties
      }
    >
      <ListingsView
        properties={propertiesPage.results ?? []}
        totalCount={propertiesPage.count}
        page={pageNumber}
        totalPages={totalPages}
      />
    </div>
  )
}
