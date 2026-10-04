'use server'

import { getApiClient } from '@/lib/api'
import { getSession } from '@/lib/auth'

export async function toggleSavedPropertyAction(propertyId: string, saved: boolean): Promise<boolean> {
  const session = await getSession()
  if (!session) {
    return false
  }

  const apiClient = await getApiClient(session)

  if (saved) {
    await apiClient.properties.propertiesSaveCreate(propertyId)
  } else {
    await apiClient.properties.propertiesUnsaveCreate(propertyId)
  }

  return true
}
