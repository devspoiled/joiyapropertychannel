import { getApiClient } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

// ponytail: reuses the properties list endpoint's `q` filter instead of a
// dedicated search/suggest endpoint — good enough until suggestions need
// their own ranking or other entity types.
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 3) return NextResponse.json([])

  const apiClient = await getApiClient()
  const page = await apiClient.properties.propertiesList(
    undefined,
    undefined,
    undefined,
    1,
    6,
    undefined,
    q
  )

  const results = (page.results ?? []).map((p) => ({
    id: p.id,
    address: p.address,
    city: p.neighborhood.city,
    neighborhood: p.neighborhood.name
  }))

  return NextResponse.json(results)
}
