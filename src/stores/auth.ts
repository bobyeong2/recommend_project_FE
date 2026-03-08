import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'
import { login as loginApi, register as registerApi, getMe, logout as logoutApi } from '../api/auth'

// defineStore('스토어이름', 함수)
// 스토어 이름은 앱 전체에서 고유해야 합니다
// 여러 컴포넌트에서 useAuthStore() 를 호출하면 항상 같은 인스턴스를 반환합니다
export const useAuthStore = defineStore('auth', () => {

  // ref() = 반응형 변수
  // 값이 바뀌면 이 값을 사용하는 모든 화면이 자동으로 업데이트됩니다
  const user = ref<User | null>(null)
  const token = ref<string | null>(
    localStorage.getItem('access_token')  // 앱 시작 시 저장된 토큰 복원
  )

  // computed() = 다른 반응형 변수에서 파생된 값
  // token 이 바뀌면 isLoggedIn 도 자동으로 재계산됩니다
  // !! = 값을 boolean으로 변환 (null → false, "토큰값" → true)
  const isLoggedIn = computed(() => !!token.value)

  // 로그인
  // as = 함수 이름 충돌 방지를 위해 import 시 이름을 변경하는 문법입니다
  // login as loginApi → loginApi 라는 이름으로 사용
  const login = async (email: string, password: string) => {
    const response = await loginApi({ email, password })

    // 토큰을 상태(ref)와 브라우저 저장소(localStorage) 양쪽에 저장
    // ref: 화면 반응성을 위해 / localStorage: 새로고침 후에도 유지되도록
    token.value = response.access_token
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('refresh_token', response.refresh_token)

    await fetchUser()
  }

  // 회원가입
  const register = async (email: string, username: string, password: string) => {
    // 회원가입 후 자동 로그인 처리
    await registerApi({ email, username, password })
    await login(email, password)
  }

  // 로그아웃
  const logout = async () => {
    try {
      await logoutApi()  // 백엔드에 로그아웃 요청
    } catch {
      // 백엔드 요청 실패해도 클라이언트 토큰은 반드시 삭제
    } finally {
      // finally: try/catch 결과와 상관없이 항상 실행됩니다
      user.value = null
      token.value = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  // 사용자 정보 조회
  // 앱 시작 시 저장된 토큰으로 사용자 정보를 복원할 때 사용
  const fetchUser = async () => {
    try {
      user.value = await getMe()
    } catch {
      // 토큰이 유효하지 않으면 로그아웃 처리
      await logout()
    }
  }

  // return 한 것들만 컴포넌트에서 사용 가능합니다
  return { user, token, isLoggedIn, login, register, logout, fetchUser }
})