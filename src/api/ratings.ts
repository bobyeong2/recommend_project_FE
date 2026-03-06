import apiClient from "./client";
import type { Rating,RatingWithMovie } from "../types"

// 평점 등록
// RatingCreate schema : movie_id, rating (1.0 ~ 10.0, 0.5 step)
export const createRating = async (data: {
    movie_id: number
    rating: number
}): Promise<Rating> => {
    const response = await apiClient.post<Rating>("/api/v1/ratings",data)
    return response.data
}

// 내 평점 목록 조회
export const getMyRatings = async (skip = 0, limit = 20): Promise<RatingWithMovie[]> => {
    const response = await apiClient.get<RatingWithMovie[]>("api/v1/ratings",{
        params: { skip, limit }
    })
    return response.data
}

// 특정 영화에 대한 내 평점을 조회
// 영화 상세 페이지에서 "이미 평점을 남겼는지" 확인할 때 사용
export const getMyRatingForMovie = async (movie_id: number): Promise<Rating> => {
    const response = await apiClient.get<Rating>(`/api/v1/ratings/movie/${movie_id}`)
    return response.data
}

// 평점 수정
export const updateRating = async (rating_id: number, rating: number): Promise<Rating> => {
    const response = await apiClient.put<Rating>(`api/v1/ratings/${rating_id}`,{ rating })
    return response.data
}

// 평점 삭제
// 백엔드가 204 No Contetnt 반환 -> 응답 본문 없음 -> Promise<void> return
export const deleteRating = async (rating_id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/ratings/${rating_id}`)
}