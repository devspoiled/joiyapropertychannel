'use server'

import { getApiClient } from '@/lib/api'
import { ApiError } from '@frontend/types/api'

export async function contactAction(data: {
  name: string
  email: string
  phone?: string
  message: string
}): Promise<boolean> {
  try {
    const apiClient = await getApiClient()
    await apiClient.contact.contactCreate(data)
    return true
  } catch (error) {
    if (error instanceof ApiError) {
      return false
    }
    throw error
  }
}
