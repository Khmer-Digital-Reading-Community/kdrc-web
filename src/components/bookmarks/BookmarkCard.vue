<template>
  <div
    class="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition"
  >
    <div class="relative">
      <img
        :src="bookmark.coverImage"
        :alt="bookmark.title"
        class="w-full h-52 object-cover"
      />

      <div class="absolute top-3 left-3">
        <span
          class="bg-[#0B2B2F] text-white text-xs px-3 py-1 rounded-full"
        >
          {{ bookmark.type }}
        </span>
      </div>

        <button
            class="absolute top-3 right-3
                bg-white/90 backdrop-blur-sm
                p-2 rounded-full
                shadow-md
                hover:scale-105
                transition"
        >
            <BookmarkIcon
            class="w-4 h-4 text-[#0B2B2F]"
            fill="#0B2B2F"
            />
        </button>
    </div>

    <div class="p-4">
      <p class="text-xs text-gray-400 mb-2">
        SAVED {{ bookmark.createdAt }}
      </p>

      <h3 class="font-semibold text-lg line-clamp-2">
        {{ bookmark.title }}
      </h3>

      <div class="flex items-center justify-between mt-4">
        <div>
          <p
            v-if="bookmark.author"
            class="text-sm text-gray-600"
          >
            {{ bookmark.author }}
          </p>

          <p
            v-if="bookmark.source"
            class="text-sm text-gray-600"
          >
            {{ bookmark.source }}
          </p>
        </div>

        <button>
          ⋮
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bookmark } from "../../types/bookmark";

import { BookmarkIcon } from "lucide-vue-next";

defineProps<{
  bookmark: Bookmark;
}>();
</script>