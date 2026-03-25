import apiClient from './client'
import type { RecommendationResponse, PredictionRequest, PredictionResponse } from '../types'

// 로그인한 사용자 기준 추천 (JWT 자동 인식)
// 평점 등록/수정/삭제 후 이 함수를 다시 호출하면 최신 추천 반영
export const getMyRecommendations = async (top_k = 10): Promise<RecommendationResponse> => {
  const response = await apiClient.get<RecommendationResponse>('/api/v1/recommendations', {
    params: { top_k }
  })
  return response.data
}

// training_user_id 기반 추천 (레거시, 관리자용)
export const getRecommendationsByUserId = async (
  user_id: number,
  top_k = 10
): Promise<RecommendationResponse> => {
  const response = await apiClient.get<RecommendationResponse>(
    `/api/v1/recommendations/${user_id}`,
    { params: { top_k } }
  )
  return response.data
}

export const predictRatings = async (
  data: PredictionRequest
): Promise<PredictionResponse> => {
  const response = await apiClient.post<PredictionResponse>(
    '/api/v1/recommendations/predict',
    data
  )
  return response.data
}