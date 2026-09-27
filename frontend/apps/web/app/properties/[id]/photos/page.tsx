import { PropertyPhotos } from '@/components/properties/property-photos'
import { getApiClient } from '@/lib/api'
import { ApiError } from '@frontend/types/api'
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
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

export default async function PropertyPhotosPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const apiClient = await getApiClient()

  const property = await apiClient.properties.propertiesRetrieve(id).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  })

  if (!property) notFound()

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
      <PropertyPhotos property={property} />
    </div>
  )
}
