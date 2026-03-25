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

        <h2 class="text-lg font-semibold text-text-primary mb-5">로그인</h2>

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

          <div class="mb-6">
            <label class="block text-xs font-medium text-text-secondary mb-1.5">비밀번호</label>
            <input
              v-model="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              class="w-full bg-surface-overlay border border-border-subtle rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-accent text-surface font-semibold py-2.5 rounded-lg hover:bg-accent-hover disabled:opacity-50 text-sm"
          >
            {{ isLoading ? '로그인 중...' : '로그인' }}
          </button>

        </form>

        <p class="mt-5 text-center text-xs text-text-muted">
          계정이 없으신가요?
          <RouterLink to="/register" class="text-accent hover:text-accent-hover font-medium ml-1">
            회원가입
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
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = '이메일과 비밀번호를 입력해주세요'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/movies')
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = '이메일 또는 비밀번호가 올바르지 않습니다'
    }
  } finally {
    isLoading.value = false
  }
}
</script>