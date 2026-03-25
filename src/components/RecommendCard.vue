<template>
  <div class="min-w-[180px] max-w-[180px] flex-shrink-0 bg-surface-raised rounded-xl overflow-hidden cursor-pointer border border-border-subtle hover:border-accent-dim transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5">

    <!-- Score header -->
    <div class="bg-gradient-to-r from-accent/20 to-accent/5 px-3.5 py-3 border-b border-border-subtle">
      <div class="flex items-baseline gap-1.5">
        <span class="text-accent text-xl font-bold">{{ item.predicted_rating.toFixed(1) }}</span>
        <span class="text-text-muted text-xs">/10</span>
      </div>
      <p class="text-xs text-text-muted mt-0.5">예측 평점</p>
    </div>

    <!-- Movie info -->
    <div class="p-3.5">
      <h3 class="font-semibold text-text-primary text-sm line-clamp-2 h-10 leading-5">
        {{ item.title }}
      </h3>

      <p v-if="item.genres" class="text-xs text-text-muted mt-2 truncate">
        {{ item.genres }}
      </p>

      <!-- Reason tag -->
      <div class="mt-3">
        <span class="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">
          {{ reasonText }}
        </span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RecommendationItem } from '../types'

const props = defineProps<{
  item: RecommendationItem
}>()

const reasonText = computed(() => {
  switch (props.item.reason) {
    case 'ncf_prediction':
      return '평점 패턴 기반'
    case 'popular':
      return '인기 영화'
    case 'content_based':
      return '장르 유사'
    case 'hybrid':
      return 'AI 추천'
    default:
      return '맞춤 추천'
  }
})
</script>