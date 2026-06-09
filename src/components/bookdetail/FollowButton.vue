<script setup lang="ts">
import { useFollow } from "../../composables/useFollow";
import { token } from "../../services/auth";

const props = defineProps<{
  authorId: string;
  authorName: string;
}>();

const { isFollowing, followersCount, loading, toggleFollow } = useFollow(
  props.authorId,
);
</script>

<template>
  <div v-if="token" class="flex items-center gap-3">
    <button
      @click="toggleFollow"
      :disabled="loading"
      class="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 border"
      :class="
        isFollowing
          ? 'bg-[#093A3F] text-white border-[#093A3F] hover:bg-red-600 hover:border-red-600'
          : 'bg-[#c5a050] text-white border-[#c5a050] hover:bg-[#b8913f]'
      "
    >
      <span v-if="loading">...</span>
      <span v-else>{{ isFollowing ? 'Following' : 'Follow' }}</span>
    </button>
    <span class="text-sm text-gray-500">
      {{ followersCount }} {{ followersCount === 1 ? 'follower' : 'followers' }}
    </span>
  </div>
</template>
