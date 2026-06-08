<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAuthorProfile } from "../../services/followApi";
import FollowButton from "../../components/bookdetail/FollowButton.vue";
import ExploreBookCard from "../../components/explore/ExploreBookCard.vue";

const route = useRoute();
const router = useRouter();

interface AuthorProfile {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  booksCount: number;
  books: Array<{
    id: string;
    title: string;
    coverImageUrl?: string;
    rating: number;
    readCount: number;
    createdAt: string;
  }>;
}

const author = ref<AuthorProfile | null>(null);
const loading = ref(true);
const error = ref("");

const fetchProfile = async () => {
  try {
    author.value = await getAuthorProfile(route.params.id as string);
  } catch {
    error.value = "Author not found";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProfile);
</script>

<template>
  <div class="bg-[#F8F9F8] min-h-screen pb-20">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-8 pt-8">
      <div v-if="loading" class="text-center py-24 text-gray-500">
        Loading...
      </div>

      <div v-else-if="error" class="text-center py-24">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button
          @click="router.push('/home')"
          class="text-[#c5a050] font-semibold hover:underline"
        >
          Go back home
        </button>
      </div>

      <template v-else-if="author">
        <div class="bg-white rounded-2xl p-8 shadow-sm border border-[#e8e4dc] mb-8">
          <div class="flex flex-col sm:flex-row items-start gap-6">
            <div
              class="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0"
              :style="{
                background: `linear-gradient(135deg, #093A3F, #c5a050)`,
              }"
            >
              {{ author.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>

            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold text-[#093A3F] font-['Playfair_Display',Georgia,serif]">
                {{ author.name }}
              </h1>
              <p v-if="author.bio" class="text-gray-500 mt-2 leading-relaxed">
                {{ author.bio }}
              </p>
              <div class="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span>{{ author.booksCount }} books</span>
                <span>{{ author.followersCount }} followers</span>
                <span>{{ author.followingCount }} following</span>
              </div>
              <div class="mt-4">
                <FollowButton
                  :authorId="author.id"
                  :authorName="author.name"
                />
              </div>
            </div>
          </div>
        </div>

        <h2 class="text-xl font-bold text-[#093A3F] mb-6 font-['Playfair_Display',Georgia,serif]">
          Published Books
        </h2>

        <div
          v-if="author.books.length === 0"
          class="text-center py-12 text-gray-400"
        >
          No published books yet.
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="book in author.books"
            :key="book.id"
            class="bg-white rounded-xl shadow-sm border border-[#e8e4dc] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            @click="router.push(`/book-detail/${book.id}`)"
          >
            <div class="h-48 bg-gradient-to-br from-[#093A3F]/10 to-[#c5a050]/10 flex items-center justify-center">
              <img
                v-if="book.coverImageUrl"
                :src="book.coverImageUrl"
                :alt="book.title"
                class="w-full h-full object-cover"
              />
              <svg
                v-else
                class="w-10 h-10 text-gray-300"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-[#093A3F] truncate">{{ book.title }}</h3>
              <div class="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <span>★ {{ book.rating || 0 }}</span>
                <span>·</span>
                <span>{{ book.readCount || 0 }} reads</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
