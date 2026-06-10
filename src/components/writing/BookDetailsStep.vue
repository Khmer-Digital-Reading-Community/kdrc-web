<template>
  <div class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-[#123C3A] font-['Playfair_Display',Georgia,serif]">
        Book Details
      </h2>
      <p class="text-sm text-gray-500 mt-2">Add the finishing touches</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
      <!-- Form -->
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-[#123C3A] mb-2">
            Title <span class="text-red-400">*</span>
          </label>
          <input
            :value="title"
            @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Enter book title"
            class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050]"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-[#123C3A] mb-2">Subtitle</label>
          <input
            :value="subtitle"
            @input="$emit('update:subtitle', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Optional subtitle or tagline"
            class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050]"
          />
        </div>
      </div>

      <!-- Cover -->
      <div>
        <label class="block text-sm font-semibold text-[#123C3A] mb-2">Cover Image</label>

        <div
          v-if="coverPreviewUrl"
          class="relative rounded-xl overflow-hidden border-2 border-gray-200 aspect-[2/3] mb-3"
        >
          <img :src="coverPreviewUrl" alt="Cover preview" class="w-full h-full object-cover" />
          <button
            @click="$emit('clearCover')"
            type="button"
            class="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition shadow"
          >
            &times;
          </button>
        </div>

        <label
          :class="[
            'flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200',
            coverPreviewUrl
              ? 'border-gray-200 hover:border-[#c5a050]'
              : 'border-gray-300 hover:border-[#c5a050] hover:bg-amber-50/30',
          ]"
        >
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
          <span class="text-xs text-gray-500">{{ coverPreviewUrl ? 'Change cover' : 'Upload cover (JPG/PNG)' }}</span>
          <input
            type="file"
            accept="image/jpeg,image/png"
            class="hidden"
            @change="onFileChange"
          />
        </label>

        <p v-if="isUploading" class="text-xs text-amber-600 mt-2">Uploading cover...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  coverPreviewUrl: string | null;
  isUploading: boolean;
}>();

const emit = defineEmits<{
  "update:title": [value: string];
  "update:subtitle": [value: string];
  fileSelected: [file: File];
  clearCover: [];
}>();

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) emit("fileSelected", file);
}
</script>
