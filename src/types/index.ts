// 👤 사용자 응답 (UserResponse)
export interface User {
  id: number
  email: string
  username: string
  full_name: string | null   // null일 수 있음
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
}

// 🔑 토큰 응답 (Token)
export interface AuthToken {
  access_token: string
  refresh_token: string      // 백엔드가 refresh_token도 줌
  token_type: string         // "bearer"
}

// 🎬 영화 응답 (MovieResponse)
export interface Movie {
  id: number
  title: string
  original_title: string | null
  overview: string | null    // 줄거리
  genres: string[] | null    // 장르 배열 ["액션", "드라마"]
  runtime: number | null     // 상영시간 (분)
  release_date: string | null
  poster_path: string | null
  mean_rating: number | null // 평균 평점
  popularity: number | null
}

// ⭐ 평점 응답 (RatingResponse)
export interface Rating {
  id: number
  user_id: number
  movie_id: number
  rating: number             // 1.0 ~ 10.0, 0.5 단위
  created_at: string
  updated_at: string
}

// ⭐ 평점 + 영화 제목 (RatingWithMovie) - 내 평점 목록에서 사용
export interface RatingWithMovie {
  id: number
  movie_id: number
  movie_title: string        // 영화 제목 포함
  rating: number
  created_at: string
  updated_at: string
}


// 📊 평점 예측 요청
export interface PredictionRequest {
  user_id: number
  movie_ids: number[]
}

// 📊 평점 예측 응답
export interface PredictionItem {
  movie_id: number
  predicted_rating: number
}

export interface PredictionResponse {
  user_id: number
  predictions: PredictionItem[]
}

export interface RecommendationItem {
  movie_id: number
  title: string
  predicted_rating: number
  genres: string | null
  reason: string | null
  strategy: string | null
}

// 추천 응답
export interface RecommendationResponse {
  user_id: number
  recommendations: RecommendationItem[]
}