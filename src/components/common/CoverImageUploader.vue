<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    label?: string
    helperText?: string
    error?: string | null
    maxSizeMb?: number
  }>(),
  {
    modelValue: null,
    label: 'Cover Image',
    helperText: 'PNG or JPG up to 2MB',
    error: null,
    maxSizeMb: 2,
  },
)

const emit = defineEmits<{
  fileSelected: [file: File]
  clear: []
}>()

const localError = ref<string | null>(null)

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      localError.value = null
    }
  },
)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  localError.value = null

  const isImage = file.type.startsWith('image/')
  const maxSizeBytes = props.maxSizeMb * 1024 * 1024

  if (!isImage) {
    localError.value = 'Please select a valid image file.'
    input.value = ''
    return
  }

  if (file.size > maxSizeBytes) {
    localError.value = `File size must be under ${props.maxSizeMb}MB.`
    input.value = ''
    return
  }

  emit('fileSelected', file)
}
</script>

<template>
  <div class="w-full">
    <label class="block text-sm font-semibold text-[#123C3A] mb-2">{{ label }}</label>

    <div
      class="relative w-full rounded-2xl border-2 border-dashed border-amber-300 bg-white/70 overflow-hidden"
    >
      <div v-if="modelValue" class="relative">
        <img
          :src="modelValue"
          alt="Cover preview"
          class="w-full aspect-[2/3] object-cover"
        />
        <button
          type="button"
          class="absolute top-3 right-3 bg-white/90 text-[#123C3A] text-xs font-semibold px-3 py-1 rounded-full shadow"
          @click="emit('clear')"
        >
          Remove
        </button>
      </div>

      <div v-else class="p-6 flex flex-col items-center justify-center text-center">
        <div class="mb-3 text-amber-700">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p class="text-sm font-medium text-[#123C3A]">Upload cover image</p>
        <p class="text-xs text-gray-500 mt-1">{{ helperText }}</p>
      </div>

      <input
        type="file"
        accept="image/*"
        class="absolute inset-0 opacity-0 cursor-pointer"
        @change="handleFileChange"
      />
    </div>

    <p v-if="localError || error" class="text-xs text-red-600 mt-2">
      {{ localError || error }}
    </p>
  </div>
</template>
