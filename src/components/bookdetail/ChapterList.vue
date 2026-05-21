<template>
  <div>

    <div class="mb-6">

      <h2 class="text-2xl font-bold text-gray-900 mb-1">
        Table of Contents
      </h2>

      <p class="text-sm text-gray-500">
        The architectural bones of the story.
      </p>

    </div>

    <div class="space-y-3">

      <ChapterItem
        v-for="(chapter, index) in chapters"
        :key="chapter.id"
        :chapter="chapter"
        :index="index"
      />

    </div>

  </div>
</template>

<script setup lang="ts">
import type { Chapter } from "../../types/bookDetails";

import ChapterItem from "./ChapterItem.vue";

defineProps<{
  chapters: Chapter[];
}>();
</script>