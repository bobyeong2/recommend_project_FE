<template>
  <nav class="border-b border-border-subtle bg-surface-raised/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Logo -->
      <RouterLink to="/movies" class="flex items-center gap-2 group">
        <span class="text-2xl">🎬</span>
        <span class="text-lg font-bold text-accent group-hover:text-accent-hover tracking-wide">
          BOB MOVIE
        </span>
      </RouterLink>

      <!-- Right side -->
      <div class="flex items-center gap-6">
        <RouterLink
          to="/movies"
          class="text-sm text-text-secondary hover:text-text-primary font-medium"
        >
          홈
        </RouterLink>

        <RouterLink
          to="/profile"
          class="text-sm text-text-secondary hover:text-text-primary font-medium"
        >
          {{ authStore.user?.username }}
        </RouterLink>

        <button
          @click="handleLogout"
          class="text-sm text-text-muted hover:text-danger font-medium cursor-pointer"
        >
          로그아웃
        </button>
      </div>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>