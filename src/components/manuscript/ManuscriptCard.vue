<script setup lang="ts">
import { ref } from 'vue'
import { MoreVertical, Trash2, Edit3 } from 'lucide-vue-next'
import { apiBaseUrl } from '@/services/api'

defineProps<{
  title: string
  words: string
  edit: string
  status: string
  coverImageUrl?: string | null
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()

const showMenu = ref(false)
const imageLoaded = ref(false)
const imageError = ref(false)

const resolveCoverUrl = (url?: string | null) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${apiBaseUrl}${url}`
}
</script>

<template>
  <div
    class="bg-[#FBF7F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
  >

    <!-- Cover -->
    <div
      class="h-64 bg-gradient-to-br from-[#2A241D] to-[#0B0A09] relative overflow-hidden"
    >
      <!-- Cover Image -->
      <img
        v-if="coverImageUrl && !imageError"
        :src="resolveCoverUrl(coverImageUrl)"
        :alt="title"
        @load="imageLoaded = true"
        @error="imageError = true"
        class="w-full h-full object-cover"
      />

      <!-- Fallback Gradient (when no image or error) -->
      <div
        v-if="!coverImageUrl || imageError"
        class="w-full h-full bg-gradient-to-br from-[#2A241D] to-[#0B0A09]"
      />

      <!-- Status Badge -->
      <span
        :class="[
          'absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full font-bold uppercase',
          status === 'PUBLISHED' ? 'bg-[#2FE0A5] text-[#123C3A]' : 'bg-amber-400 text-[#123C3A]'
        ]"
      >
        {{ status }}
      </span>

    </div>

    <!-- Content -->
    <div class="p-4">

      <!-- Title -->
      <h2
        class="font-bold text-[#123C3A] text-lg leading-snug mb-2 line-clamp-1"
      >
        {{ title }}
      </h2>

      <!-- Meta -->
      <div class="text-sm text-gray-500 space-y-1 mb-4">

        <p>{{ words }}</p>

        <p>Last Edit: {{ edit }}</p>

      </div>

      <!-- Bottom -->
      <div class="flex items-center justify-between relative">

        <!-- Button -->
        <button
          @click="emit('edit')"
          class="bg-[#1BC47D] hover:bg-[#16a56a] text-white text-xs px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <Edit3 :size="14" />
          Continue Edit
        </button>

        <!-- Menu -->
        <div class="relative">
          <button 
            @click="showMenu = !showMenu"
            class="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
          >
            <MoreVertical :size="20" />
          </button>

          <!-- Dropdown -->
          <div 
            v-if="showMenu"
            class="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden"
          >
            <button 
              @click="emit('delete'); showMenu = false"
              class="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 :size="14" />
              Delete Story
            </button>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>