import apiClient from "./client"
import type { Movie } from "../types"

// 영화 목록 조회
// 백엔드 파라미터 : skip (건너뛸 개수), limit(가져올 최대 개수)
// skip = 0, limit = 20 -> 1page
// skip = 20, limit = 20 -> 2page

export const getMovies = async (skip = 0, limit = 20): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>("/api/v1/movies", {
        params: {skip, limit }
        // param option : 객체를 URL 쿼리스트링으로 자동 변환
        // { skip:0, limit:20} => ?skip=0&limit=20
    })
    return response.data
}

export const getMovie = async (id: number): Promise<Movie> => {
    const response = await apiClient.get<Movie>(`/api/v1/movies/${id}`)
    return response.data
}

// 영화 검색
export const searchMovies = async(q: string, limit = 20): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>("/api/v1/movies/search", {
        params: {q, limit}
    })
    return response.data
}