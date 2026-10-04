import type { auth } from '@/lib/auth'
import { ApiClient } from '@frontend/types/api'

type Session = Awaited<ReturnType<typeof auth.api.getSession>>

async function refreshAccessToken(djangoRefresh: string): Promise<string | undefined> {
  const res = await fetch(`${process.env.API_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: djangoRefresh })
  })

  if (!res.ok) {
    return undefined
  }

  const { access } = await res.json()
  return access
}

export async function getApiClient(session?: Session | null) {
  const djangoRefresh = session?.session.djangoRefresh
  const accessToken = djangoRefresh ? await refreshAccessToken(djangoRefresh) : undefined

  return new ApiClient({
    BASE: process.env.API_URL,
    HEADERS: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` })
    }
  })
}
