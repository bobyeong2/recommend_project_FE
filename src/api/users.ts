import apiClient from './client'
import type { User } from '../types'

// 내 정보 수정
// PUT /api/v1/users/me
// 현재 BE에서 username만 수정 가능
export const updateMyInfo = async (data: {
  username?: string
}): Promise<User> => {
  const response = await apiClient.put<User>('/api/v1/users/me', data)
  return response.data
}