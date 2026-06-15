<template>
  <div class="min-h-screen bg-[#F8F9F8] py-16 px-6">
    <div class="max-w-5xl mx-auto">
      <div
        class="text-center flex flex-col gap-4 justify-content item-center mb-12"
      >
        <h1 class="font-serif text-3xl text-[#093A3F] mb-2">Our Writers</h1>
        <h5 class="text-gray-600 max-w-xl mx-auto">
          Discover the voices shaping Khmer literature today. From seasoned
          authors to emerging talents, our community of writers brings stories
          to life.
        </h5>
      </div>

      <div v-if="loading" class="text-center py-16 text-gray-500">
        Loading writers...
      </div>

      <div v-else-if="error" class="text-center py-16 text-red-500">
        {{ error }}
      </div>

      <div
        v-else-if="writers.length === 0"
        class="text-center py-16 text-gray-400"
      >
        No writers found yet.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="writer in writers"
          :key="writer.id"
          class="bg-white rounded-lg p-6 border border-gray-200 text-center hover:border-[#F9AE5B] transition-colors cursor-pointer"
          @click="viewProfile(writer.id)"
        >
          <img
            v-if="writer.avatarUrl"
            :src="writer.avatarUrl"
            :alt="writer.name"
            class="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
          />
          <div
            v-else
            class="w-16 h-16 rounded-full bg-[#093A3F]/10 mx-auto mb-4 flex items-center justify-center"
          >
            <span class="font-serif text-xl text-[#093A3F]">{{
              writer.name.charAt(0)
            }}</span>
          </div>
          <h3 class="font-semibold text-[#093A3F]">{{ writer.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">
            {{ writer.booksCount }}
            {{ writer.booksCount === 1 ? "book" : "books" }} published
          </p>
          <p v-if="writer.bio" class="text-sm text-gray-400 mt-2 line-clamp-2">
            {{ writer.bio }}
          </p>
        </div>
      </div>

      <div class="text-center mt-12">
        <p class="text-gray-500 text-sm">
          Are you a writer?
          <router-link
            to="/dashboard/books/new"
            class="text-[#093A3F] underline hover:text-[#F9AE5B]"
          >
            Start writing today
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuthors, type AuthorSummary } from "../../services/userApi";

const router = useRouter();
const writers = ref<AuthorSummary[]>([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    writers.value = await getAuthors();
  } catch (e: any) {
    error.value = "Failed to load writers. Please try again later.";
    console.error("Error fetching authors:", e);
  } finally {
    loading.value = false;
  }
});

function viewProfile(id: string) {
  router.push(`/user/${id}`);
}
</script>
