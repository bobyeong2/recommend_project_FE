<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-text-primary mb-8">내 프로필</h1>

    <div class="bg-surface-raised border border-border-subtle rounded-2xl p-7">

      <!-- Read-only info -->
      <div class="grid grid-cols-2 gap-y-5 mb-7">
        <div>
          <p class="text-xs text-text-muted mb-1">이메일</p>
          <p class="text-sm text-text-primary">{{ authStore.user?.email }}</p>
        </div>
        <div>
          <p class="text-xs text-text-muted mb-1">역할</p>
          <p class="text-sm text-text-primary">{{ authStore.user?.role }}</p>
        </div>
        <div>
          <p class="text-xs text-text-muted mb-1">가입일</p>
          <p class="text-sm text-text-primary">{{ authStore.user?.created_at }}</p>
        </div>
        <div>
          <p class="text-xs text-text-muted mb-1">상태</p>
          <span
            class="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
            :class="authStore.user?.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
          >
            {{ authStore.user?.is_active ? '활성' : '비활성' }}
          </span>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-border-subtle my-7" />

      <!-- Editable field -->
      <div class="mb-6">
        <label class="block text-xs font-medium text-text-secondary mb-1.5">사용자명</label>
        <input
          v-model="username"
          type="text"
          class="w-full bg-surface-overlay border border-border-subtle rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          placeholder="영문, 숫자, 언더스코어만 가능"
        />
        <p v-if="usernameError" class="text-danger text-xs mt-1.5">{{ usernameError }}</p>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="bg-success/10 border border-success/20 text-success p-3 rounded-lg mb-5 text-sm">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg mb-5 text-sm">
        {{ errorMessage }}
      </div>

      <!-- Save -->
      <button
        @click="handleSave"
        :disabled="isSaving || !hasChanged"
        class="w-full bg-accent text-surface font-semibold py-2.5 rounded-lg text-sm hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSaving ? '저장 중...' : '저장' }}
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { updateMyInfo } from '../api/users'

const authStore = useAuthStore()

const username = ref('')
const originalUsername = ref('')
const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const usernameError = computed(() => {
  if (!username.value) return '사용자명을 입력해주세요'
  if (username.value.length < 3) return '3자 이상 입력해주세요'
  if (!/^[a-zA-Z0-9_]+$/.test(username.value)) return '영문, 숫자, 언더스코어만 가능합니다'
  return ''
})

const hasChanged = computed(() => {
  return username.value !== originalUsername.value && !usernameError.value
})

const handleSave = async () => {
  if (!hasChanged.value) return
  isSaving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const updatedUser = await updateMyInfo({ username: username.value })
    authStore.user = updatedUser
    originalUsername.value = username.value
    successMessage.value = '프로필이 저장되었습니다'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (e: any) {
    errorMessage.value = e.response?.data?.detail || '저장에 실패했습니다'
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  username.value = authStore.user?.username || ''
  originalUsername.value = username.value
})
</script>