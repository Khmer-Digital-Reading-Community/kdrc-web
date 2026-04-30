<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

interface Props {
  type?: 'info' | 'warning' | 'success' | 'error'
  title?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: true
})

const isVisible = ref(true)

import { ref } from 'vue'
</script>

<template>
  <div
    v-if="isVisible"
    :class="[
      'mb-6 p-4 rounded border-l-4 flex gap-4',
      {
        'bg-blue-50 border-blue-400 text-blue-900': type === 'info',
        'bg-amber-50 border-amber-400 text-amber-900': type === 'warning',
        'bg-green-50 border-green-400 text-green-900': type === 'success',
        'bg-red-50 border-red-400 text-red-900': type === 'error'
      }
    ]"
  >
    <AlertCircle :size="20" class="flex-shrink-0 mt-0.5" />
    <div class="flex-1">
      <h4 v-if="title" class="font-semibold mb-1">{{ title }}</h4>
      <slot></slot>
    </div>
    <button
      v-if="dismissible"
      @click="isVisible = false"
      class="text-lg opacity-50 hover:opacity-100 transition flex-shrink-0"
    >
      ×
    </button>
  </div>
</template>
