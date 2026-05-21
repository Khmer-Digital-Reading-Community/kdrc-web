<template>
  <div class="grid grid-cols-3 gap-6 border-t border-gray-200 pt-6">

    <div>
      <div
        class="text-[10px] text-gray-400
               font-bold uppercase tracking-wider mb-1"
      >
        Length
      </div>

      <div class="text-sm font-semibold text-gray-900">
        {{ pages }} Pages
      </div>
    </div>

    <div>
      <div
        class="text-[10px] text-gray-400
               font-bold uppercase tracking-wider mb-1"
      >
        Language
      </div>

      <div class="text-sm font-semibold text-gray-900">
        {{ language }}
      </div>
    </div>

    <div>
      <div
        class="text-[10px] text-gray-400
               font-bold uppercase tracking-wider mb-1"
      >
        Publisher
      </div>

      <div class="text-sm font-semibold text-gray-900">
        {{ publisher }}
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  pages: number;
  language: string;
  publisher: string;
}>();
</script>