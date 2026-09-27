import { HomePage } from '@/components/home/home-page'
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

export default async function Home() {
  const apiClient = await getApiClient()
  const [propertiesPage, neighborhoodsPage] = await Promise.all([
    apiClient.properties.propertiesList(),
    apiClient.neighborhoods.neighborhoodsList()
  ])

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
      <HomePage
        properties={propertiesPage.results ?? []}
        neighborhoods={neighborhoodsPage.results ?? []}
      />
    </div>
  )
}
