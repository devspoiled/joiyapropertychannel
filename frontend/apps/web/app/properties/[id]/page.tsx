import { PropertyDetail } from '@/components/properties/property-detail'
import { getApiClient } from '@/lib/api'
import { ApiError } from '@frontend/types/api'
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

export const dynamic = 'force-dynamic'

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

export default async function PropertyDetailPage({
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

  const similarPage = await apiClient.properties.propertiesList()
  const similar = (similarPage.results ?? []).filter(
    (p) => p.id !== property.id && p.neighborhood.id === property.neighborhood.id
  )

  // Prefer what staff explicitly curated for this property in the admin;
  // only fall back to automatic distance-based nearby lookup when they
  // haven't set any.
  let nearbySchools = property.nearby_schools
  let nearbyHospitals = property.nearby_hospitals

  if (nearbySchools.length === 0 || nearbyHospitals.length === 0) {
    const lat = property.latitude ? Number(property.latitude) : null
    const lng = property.longitude ? Number(property.longitude) : null
    const [schoolsPage, hospitalsPage] =
      lat != null && lng != null
        ? await Promise.all([
            nearbySchools.length === 0 ? apiClient.schools.schoolsList(lat, 3, lng).catch(() => null) : null,
            nearbyHospitals.length === 0 ? apiClient.hospitals.hospitalsList(lat, 3, lng).catch(() => null) : null
          ])
        : [null, null]
    if (nearbySchools.length === 0) nearbySchools = schoolsPage?.results ?? []
    if (nearbyHospitals.length === 0) nearbyHospitals = hospitalsPage?.results ?? []
  }

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
      <PropertyDetail
        property={property}
        similar={similar}
        nearbySchools={nearbySchools}
        nearbyHospitals={nearbyHospitals}
      />
    </div>
  )
}
