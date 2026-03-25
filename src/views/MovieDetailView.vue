<template>
  <div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="flex gap-8">
        <div class="w-56 aspect-[2/3] bg-surface-raised rounded-xl" />
        <div class="flex-1 space-y-4">
          <div class="h-8 bg-surface-raised rounded w-2/3" />
          <div class="h-4 bg-surface-raised rounded w-1/3" />
          <div class="h-20 bg-surface-raised rounded" />
        </div>
      </div>
    </div>

    <div v-else-if="movie">
      <!-- Hero section -->
      <div class="flex flex-col md:flex-row gap-8 mb-10">

        <!-- Poster -->
        <div class="w-56 flex-shrink-0">
          <div class="aspect-[2/3] bg-surface-overlay rounded-xl overflow-hidden border border-border-subtle">
            <img
              v-if="movie.poster_path"
              :src="movie.poster_path"
              :alt="movie.title"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-text-muted text-sm"
            >
              No Poster
            </div>
          </div>
        </div>

        <!-- Movie info -->
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-text-primary mb-1">
            {{ movie.title }}
          </h1>

          <p v-if="movie.original_title" class="text-text-muted text-sm mb-5">
            {{ movie.original_title }}
          </p>

          <!-- Genre tags -->
          <div class="flex flex-wrap gap-2 mb-5">
            <span
              v-for="genre in movie.genres"
              :key="genre"
              class="bg-accent/10 text-accent text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {{ genre }}
            </span>
          </div>

          <!-- Meta info -->
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary mb-6">
            <span v-if="movie.release_date">📅 {{ movie.release_date }}</span>
            <span v-if="movie.runtime">⏱ {{ movie.runtime }}분</span>
            <span v-if="movie.mean_rating" class="text-accent font-semibold">
              ★ {{ movie.mean_rating.toFixed(1) }}
            </span>
          </div>

          <!-- Overview -->
          <p v-if="movie.overview" class="text-text-secondary text-sm leading-7">
            {{ movie.overview }}
          </p>
        </div>

      </div>

      <!-- Rating section -->
      <div class="bg-surface-raised border border-border-subtle rounded-2xl p-6">
        <h2 class="text-lg font-semibold text-text-primary mb-5">내 평점</h2>

        <!-- Already rated -->
        <div v-if="myRating">
          <div class="flex items-center gap-3 mb-5">
            <span class="text-text-secondary text-sm">현재 평점</span>
            <span class="text-accent text-2xl font-bold">{{ myRating.rating }}</span>
            <span class="text-text-muted text-sm">/ 10</span>
          </div>

          <div class="flex items-center gap-3">
            <input
              v-model.number="newRating"
              type="number"
              min="1"
              max="10"
              step="0.5"
              class="w-24 bg-surface-overlay border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent text-center"
            />
            <button
              @click="handleUpdate"
              :disabled="isSubmitting"
              class="bg-accent text-surface font-medium px-5 py-2 rounded-lg text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              수정
            </button>
            <button
              @click="handleDelete"
              :disabled="isSubmitting"
              class="bg-danger/10 text-danger border border-danger/20 font-medium px-5 py-2 rounded-lg text-sm hover:bg-danger/20 disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        </div>

        <!-- Not rated yet -->
        <div v-else>
          <p class="text-text-muted text-sm mb-4">아직 평점을 남기지 않았습니다</p>

          <div class="flex items-center gap-3">
            <input
              v-model.number="newRating"
              type="number"
              min="1"
              max="10"
              step="0.5"
              placeholder="1 ~ 10"
              class="w-24 bg-surface-overlay border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent text-center"
            />
            <button
              @click="handleCreate"
              :disabled="isSubmitting"
              class="bg-accent text-surface font-medium px-5 py-2 rounded-lg text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              평점 등록
            </button>
          </div>
        </div>

        <p v-if="error" class="text-danger text-sm mt-4">{{ error }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Movie, Rating } from '../types'
import { getMovie } from '../api/movies'
import { getMyRatingForMovie, createRating, updateRating, deleteRating } from '../api/ratings'
import { useRecommendStore } from '../stores/recommendation'

const route = useRoute()
const recommendStore = useRecommendStore()

const movie = ref<Movie | null>(null)
const myRating = ref<Rating | null>(null)
const newRating = ref<number>(5)
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref('')

const fetchData = async () => {
  isLoading.value = true
  const id = Number(route.params.id)

  const [movieResult, ratingResult] = await Promise.allSettled([
    getMovie(id),
    getMyRatingForMovie(id),
  ])

  if (movieResult.status === 'fulfilled') {
    movie.value = movieResult.value
  }
  if (ratingResult.status === 'fulfilled') {
    myRating.value = ratingResult.value
    newRating.value = ratingResult.value.rating
  }

  isLoading.value = false
}

const handleCreate = async () => {
  if (!newRating.value) {
    error.value = '평점을 입력해주세요'
    return
  }
  isSubmitting.value = true
  error.value = ''
  try {
    myRating.value = await createRating({
      movie_id: Number(route.params.id),
      rating: newRating.value,
    })
    recommendStore.markNeedsRefresh()
  } catch {
    error.value = '평점 등록에 실패했습니다'
  } finally {
    isSubmitting.value = false
  }
}

const handleUpdate = async () => {
  if (!myRating.value) return
  isSubmitting.value = true
  error.value = ''
  try {
    myRating.value = await updateRating(myRating.value.id, newRating.value)
    recommendStore.markNeedsRefresh()
  } catch {
    error.value = '평점 수정에 실패했습니다'
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!myRating.value) return
  isSubmitting.value = true
  error.value = ''
  try {
    await deleteRating(myRating.value.id)
    myRating.value = null
    newRating.value = 5
    recommendStore.markNeedsRefresh()
  } catch {
    error.value = '평점 삭제에 실패했습니다'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>