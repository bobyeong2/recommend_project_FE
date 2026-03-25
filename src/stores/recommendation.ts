import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecommendStore = defineStore('recommendation', () => {
  // 평점 변경 여부 플래그
  // true면 추천 페이지 진입 시 캐시 무시하고 새로 불러옴
  const needsRefresh = ref(false)

  const markNeedsRefresh = () => {
    needsRefresh.value = true
  }

  const clearRefreshFlag = () => {
    needsRefresh.value = false
  }

  return { needsRefresh, markNeedsRefresh, clearRefreshFlag }
})