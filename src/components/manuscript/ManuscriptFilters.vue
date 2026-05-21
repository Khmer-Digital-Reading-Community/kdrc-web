<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  search: string
  status: string
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
}>()

const statuses = ['All', 'Drafts', 'Published', 'Archived']
</script>

<template>
  <div
    class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
  >

    <!-- Search -->
    <div class="relative w-full lg:w-[320px]">

      <input
        :value="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Search your manuscripts..."
        class="w-full bg-[#EFE9DE] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-amber-600/20"
      />

      <span class="absolute left-3 top-3.5 text-gray-400">
        <Search :size="18" />
      </span>

    </div>

    <!-- Filters -->
    <div
      class="flex items-center bg-[#EFE9DE] rounded-xl overflow-hidden"
    >
      <button 
        v-for="s in statuses" 
        :key="s"
        @click="emit('update:status', s)"
        :class="[
          'px-5 py-3 text-sm font-medium transition-colors',
          status === s ? 'bg-white text-[#123C3A]' : 'text-gray-500 hover:bg-white/50'
        ]"
      >
        {{ s }}
      </button>

    </div>

  </div>
</template>