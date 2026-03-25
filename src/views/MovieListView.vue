<template>
  <div>

    <!-- 추천 섹션 -->
    <!-- 로그인했고, 추천 데이터가 있을 때만 표시 -->
    <section v-if="recommendations.length > 0" class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-gray-800">당신을 위한 추천</h2>
          <p class="text-sm text-gray-500 mt-1">{{ strategyText }}</p>
        </div>
        <!-- 새로고침 버튼 -->
        <button
          @click="fetchRecommendations"
          :disabled="isRecLoading"
          class="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 cursor-pointer"
        >
          {{ isRecLoading ? '계산 중...' : '새로고침' }}
        </button>
      </div>

      <!-- 가로 스크롤 컨테이너 -->
      <!-- overflow-x-auto = 내용이 넘치면 가로 스크롤바 표시 -->
      <!-- flex gap-4 = 카드들을 가로로 나열, 간격 16px -->
      <!-- pb-4 = 스크롤바와 콘텐츠 사이 여백 -->
      <div class="flex gap-4 overflow-x-auto pb-4">
        <RecommendCard
          v-for="item in recommendations"
          :key="item.movie_id"
          :item="item"
          @click="goToDetail(item.movie_id)"
        />
      </div>
    </section>

    <!-- 추천 로딩 중 -->
    <section v-else-if="isRecLoading" class="mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-4">당신을 위한 추천</h2>
      <div class="text-center py-8 text-gray-500">추천 영화를 계산하는 중...</div>
    </section>

    <!-- 구분선 -->
    <hr v-if="recommendations.length > 0" class="mb-8 border-gray-200" />

    <!-- 영화 목록 섹션 -->
    <section>
      <h2 class="text-xl font-bold text-gray-800 mb-4">전체 영화</h2>

      <!-- 검색창 -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="영화 제목을 검색하세요"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="text-center py-12 text-gray-500">
        불러오는 중...
      </div>

      <!-- 검색 결과 없음 -->
      <div v-else-if="movies.length === 0" class="text-center py-12 text-gray-500">
        검색 결과가 없습니다
      </div>

      <!-- 영화 그리드 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          @click="goToDetail(movie.id)"
        />
      </div>

      <!-- 더 보기 버튼 -->
      <div v-show="!isSearching && !isLoading" class="text-center mt-8">
        <button
          @click="loadMore"
          :disabled="isLoadingMore"
          class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ isLoadingMore ? '불러오는 중...' : '더 보기' }}
        </button>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
// ref = 반응형 변수 생성 (값이 바뀌면 화면이 자동 업데이트)
// computed = 다른 반응형 변수에서 파생된 값 (자동 재계산)
// onMounted = 컴포넌트가 화면에 나타날 때 1회 실행
// watch = 특정 반응형 변수의 변화를 감시
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Movie, RecommendationItem } from '../types'
import { getMovies, searchMovies } from '../api/movies'
import { getMyRecommendations } from '../api/recommendations'
import { getMyRatings } from '../api/ratings'
import { useRecommendStore } from '../stores/recommendation'
import MovieCard from '../components/MovieCard.vue'
import RecommendCard from '../components/RecommendCard.vue'

const router = useRouter()
const recommendStore = useRecommendStore()

// === 추천 관련 상태 ===
const recommendations = ref<RecommendationItem[]>([])
const isRecLoading = ref(false)
const ratingCount = ref(0)

// === 영화 목록 관련 상태 ===
const movies = ref<Movie[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const isSearching = ref(false)
const searchQuery = ref('')
const skip = ref(0)
const limit = 20

// 추천 전략 텍스트 (평점 개수에 따라 달라짐)
const strategyText = computed(() => {
  if (ratingCount.value === 0) return '인기 영화를 추천합니다'
  if (ratingCount.value <= 4) return `장르 기반 추천 (평점 ${ratingCount.value}개 반영)`
  return `AI 하이브리드 추천 (평점 ${ratingCount.value}개 반영)`
})

// === 추천 함수 ===
const fetchRecommendations = async () => {
  isRecLoading.value = true
  try {
    // 추천 결과와 평점 개수를 동시 요청
    // Promise.allSettled = 하나가 실패해도 나머지 결과를 받을 수 있습니다
    const [recResult, ratingsResult] = await Promise.allSettled([
      getMyRecommendations(10),
      getMyRatings()
    ])

    if (recResult.status === 'fulfilled') {
      recommendations.value = recResult.value.recommendations
    }

    if (ratingsResult.status === 'fulfilled') {
      ratingCount.value = ratingsResult.value.length
    }
  } catch (e) {
    console.error('추천 로드 실패:', e)
  } finally {
    isRecLoading.value = false
  }
}

// === 영화 목록 함수 (기존 로직 유지) ===
const fetchMovies = async () => {
  isLoading.value = true
  try {
    const data = await getMovies(0, limit)
    movies.value = data
    skip.value = limit
  } catch (e) {
    console.error('영화 목록 로드 실패:', e)
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  isLoadingMore.value = true
  try {
    const data = await getMovies(skip.value, limit)
    movies.value = [...movies.value, ...data]
    skip.value += limit
  } catch (e) {
    console.error('추가 로드 실패:', e)
  } finally {
    isLoadingMore.value = false
  }
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    isSearching.value = false
    await fetchMovies()
    return
  }

  isSearching.value = true
  isLoading.value = true
  try {
    movies.value = await searchMovies(searchQuery.value)
  } catch (e) {
    console.error('검색 실패:', e)
  } finally {
    isLoading.value = false
  }
}

const goToDetail = (id: number) => {
  router.push(`/movies/${id}`)
}

// 평점 변경 시 추천 자동 새로고침 (기존 RecommendView.vue에서 가져온 로직)
watch(() => recommendStore.needsRefresh, (val) => {
  if (val) {
    fetchRecommendations()
    recommendStore.clearRefreshFlag()
  }
})

// 페이지 진입 시 추천 + 영화 목록 동시 로드
onMounted(() => {
  fetchRecommendations()
  fetchMovies()
})
</script>