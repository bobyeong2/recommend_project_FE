import apiClient from "./client"
import type { RecommendationResponse, PredictionRequest, PredictionResponse } from "../types"

// 사용자 맞춤 영화 추천
// user_id : training_user_id (학습 데이터 기반 ID)
// top_k : 상위 n개 영화 추천 (기본 10, 최대 100)
export const getRecommendations = async (
    user_id: number,
    top_k = 10
): Promise<RecommendationResponse> => {
    const response = await apiClient.get<RecommendationResponse>(
        `/api/v1/recommendations/${user_id}`,
        {params: {top_k}}
    )
    return response.data
}

// 특정 영화들에 대한 평점 예측
// 내게 해당 영화가 얼만큼 흥미, 재미가 있는지 (얼만큼 유용한지)
export const predictRaetings = async (
    data: PredictionRequest
): Promise<PredictionResponse> => {
    const response = await apiClient.post<PredictionResponse>(
        "api/v1/recommendations/predict",
        data
    )
    return response.data
}
