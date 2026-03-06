import apiClient from './client'
import type { AuthToken,User } from '../types'

// 회원 가입
// user create schemas : email, username, pwd, fullname(option)
export const register = async (data:{
    email : string
    username : string
    password : string
    fullname? : string // ? field -> 옵션
}): Promise<User> => {
    // 회원가입 응답 -> UserResponse
    const response = await apiClient.post<User>('api/v1/auth/register',data)
    return response.data
}

// 로그인
export const login = async (data:{
    email: string
    password:string
}): Promise<AuthToken> => {
    const response = await apiClient.post<AuthToken>('/api/v1/auth/login',data)
    return response.data
}

// 토큰 갱신
// refresh token을 사용해 새로운 access token을 생성
export const refreshToken = async (refresh_token: string): Promise<AuthToken> => {
    const response = await apiClient.post<AuthToken>('api/v1/auth/refresh',{
        refresh_token,
    })
    return response.data
}

// 내 정보 조회
export const getMe = async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/v1/auth/me')
    return response.data
}

// 로그아웃
// 백엔드에 로그아웃 요청
// 클라이언트 토큰삭제 -> store에서 처리함

export const logout = async (): Promise<void> => {
    await apiClient.post('/api/v1/auth/logout')
}



