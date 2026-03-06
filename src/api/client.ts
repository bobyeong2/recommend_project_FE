import axios from 'axios'

// axios.create() = 공통 설정이 적용된 axios 인스턴스를 생성
// 모든 API 요청마다 baseURL, header를 반복할 필요가 없어짐
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers:{
        'Content-Type':'application/json',
    }
})

// 요청 인터셉터 (req interceptor)
// 모든 요청이 서버로 나가기 전 실행
// 역할 : localStorage에 저장된 JWT 토큰을 요청 헤더에 자동으로 붙여주기
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token")

        if (token) {
            // Fastapi의 httpbearer가 기대하는 형식 : "bearer {토큰}"
            config.headers.Authorization = `bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 응답 인터셉터(res interceptor)
// 모든 응답을 받은 후 실행
// 역할 : 토큰 만료(401) 시 자동으로 refresh token으로 재발급 시도
apiClient.interceptors.response.use(
    (response) => response, // 성공은 그대로 반환


    async (error) => {
        const originalRequest = error.config

        // 401 발생 시 retry
        // _retryL 무한 재시도 방지 플래그
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem("refresh_token")

            if (refreshToken) {
                try {
                    // refresh_token을 사용해 새로운 access token 재발급 시도
                    const {data} = await axios.post("http://localhost:8000/api/v1/auth/refresh", 
                        {
                            refresh_token : refreshToken
                        })

                    localStorage.setItem("access_token", data.access_token)
                    localStorage.setItem("refresh_token",data.refresh_token)

                    // 실패했던 요청을 새 토큰으로 재시도
                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`
                    return apiClient(originalRequest)
                }
                catch{
                    // refresh token도 만료된 경우 -> 로그아웃
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("refresh_token")
                    window.location.href = '/login'
                }
            }
            else {
                // refresh token이 없으면 로그인 페이지로 이동
                window.location.href
            }
        }
        return Promise.reject(error)
    }
)

export default apiClient