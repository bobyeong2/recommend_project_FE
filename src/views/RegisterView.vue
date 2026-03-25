<template>
  <div class="min-h-screen flex items-center justify-center -mt-8">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="text-center mb-8">
        <span class="text-4xl">🎬</span>
        <h1 class="text-2xl font-bold text-accent mt-3 tracking-wide">BOB MOVIE</h1>
        <p class="text-text-muted text-sm mt-1">AI 기반 영화 추천 서비스</p>
      </div>

      <!-- Card -->
      <div class="bg-surface-raised border border-border-subtle rounded-2xl p-7">

        <h2 class="text-lg font-semibold text-text-primary mb-5">회원가입</h2>

        <!-- Error -->
        <div v-if="error" class="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg mb-5 text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit">

          <div class="mb-4">
            <label class="block text-xs font-medium text-text-secondary mb-1.5">이메일</label>
            <input
              v-model="email"
              type="email"
              placeholder="example@email.com"
              class="w-full bg-surface-overlay border border-border-subtle rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-text-secondary mb-1.5">사용자명</label>
            <input
              v-model="username"
              type="text"
              placeholder="3자 이상, 영문/숫자/언더스코어"
              class="w-full bg-surface-overlay border border-border-subtle rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-text-secondary mb-1.5">비밀번호</label>
            <input
              v-model="password"
              type="password"
              placeholder="8~20자, 영문+숫자+특수문자"
              class="w-full bg-surface-overlay border border-border-subtle rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div class="mb-6">
            <label class="block text-xs font-medium text-text-secondary mb-1.5">이름 (선택)</label>
            <input
              v-model="fullName"
              type="text"
              placeholder="실명을 입력하세요"
              class="w-full bg-surface-overlay border border-border-subtle rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-accent text-surface font-semibold py-2.5 rounded-lg hover:bg-accent-hover disabled:opacity-50 text-sm"
          >
            {{ isLoading ? '가입 중...' : '회원가입' }}
          </button>

        </form>

        <p class="mt-5 text-center text-xs text-text-muted">
          이미 계정이 있으신가요?
          <RouterLink to="/login" class="text-accent hover:text-accent-hover font-medium ml-1">
            로그인
          </RouterLink>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const username = ref('')
const password = ref('')
const fullName = ref('')
const isLoading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!email.value || !username.value || !password.value) {
    error.value = '이메일, 사용자명, 비밀번호는 필수 입력입니다'
    return
  }
  if (username.value.length < 3) {
    error.value = '사용자명은 3자 이상이어야 합니다'
    return
  }
  if (password.value.length < 8) {
    error.value = '비밀번호는 8자 이상이어야 합니다'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await authStore.register(email.value, username.value, password.value)
    router.push('/movies')
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = '회원가입에 실패했습니다. 입력값을 확인해주세요'
    }
  } finally {
    isLoading.value = false
  }
}
</script>