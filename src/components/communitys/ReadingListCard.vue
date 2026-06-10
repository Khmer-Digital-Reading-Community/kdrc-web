<script setup lang="ts">
import { BookOpen } from "lucide-vue-next";
import type { ReadingList } from "../../services/readingListApi";
import { resolveCoverUrl } from "../../services/exploreApi";

defineProps<{
  list: ReadingList;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <div
    @click="$emit('click')"
    class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
  >
    <div class="p-5">
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-bold text-gray-900 truncate">{{ list.name }}</h3>
        <span
          v-if="!list.isPublic"
          class="text-[10px] font-bold uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded"
        >
          Private
        </span>
      </div>
      <p
        v-if="list.description"
        class="text-sm text-gray-500 line-clamp-2 mb-3"
      >
        {{ list.description }}
      </p>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <BookOpen :size="14" />
        <span>{{ list.items?.length ?? 0 }} books</span>
      </div>
      <p v-if="list.owner?.name" class="text-xs text-gray-400 mt-2">
        by {{ list.owner.name }}
      </p>
    </div>
  </div>
</template>
