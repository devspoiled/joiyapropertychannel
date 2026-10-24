'use server'

import { getApiClient } from '@/lib/api'
import { ApiError, PropertyTypeEnum } from '@frontend/types/api'

export async function sellRequestAction(data: {
  name: string
  email: string
  phone: string
  property_type: PropertyTypeEnum
  address: string
  city: string
  demanding_price_lac: number
  latitude?: string
  longitude?: string
}): Promise<boolean> {
  try {
    const apiClient = await getApiClient()
    await apiClient.sellRequests.sellRequestsCreate(data)
    return true
  } catch (error) {
    if (error instanceof ApiError) {
      return false
    }
    throw error
  }
}
