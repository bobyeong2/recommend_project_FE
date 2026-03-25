<template>
  <div class="group relative bg-surface-raised rounded-xl overflow-hidden cursor-pointer border border-border-subtle hover:border-accent-dim transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5">

    <!-- Poster -->
    <div class="aspect-[2/3] bg-surface-overlay overflow-hidden">
      <img
        v-if="movie.poster_path"
        :src="movie.poster_path"
        :alt="movie.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-text-muted text-sm"
      >
        No Poster
      </div>
    </div>

    <!-- Info -->
    <div class="p-3.5">
      <h3 class="font-semibold text-text-primary text-sm truncate">
        {{ movie.title }}
      </h3>
      <p class="text-xs text-text-muted mt-1.5">
        {{ movie.release_date ? movie.release_date.slice(0, 4) : '-' }}
        <span v-if="movie.genres" class="ml-1.5">
          · {{ movie.genres.slice(0, 2).join(', ') }}
        </span>
      </p>
      <!-- Rating badge -->
      <div v-if="movie.mean_rating" class="mt-2.5 inline-flex items-center gap-1 bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5 rounded-full">
        <span>★</span>
        <span>{{ movie.mean_rating.toFixed(1) }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Movie } from '../types'

defineProps<{
  movie: Movie
}>()
</script>