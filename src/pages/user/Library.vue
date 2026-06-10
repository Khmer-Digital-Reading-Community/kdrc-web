<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";
import { usePurchases } from "../../composables/usePurchases";
import { token } from "../../services/auth";
import { resolveCoverUrl } from "../../services/exploreApi";

const router = useRouter();
const { credits, library, libraryLoading, topUpCredits } = usePurchases();
const topUpAmount = ref(100);
const topUpLoading = ref(false);

const handleTopUp = async () => {
  topUpLoading.value = true;
  await topUpCredits(topUpAmount.value);
  topUpLoading.value = false;
};

const goToBook = (bookId: string) => {
  router.push(`/book-detail/${bookId}`);
};
</script>

<template>
  <div class="relative flex h-screen overflow-hidden bg-[#F6F1E8]">
    <Sidebar />
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="p-3 sm:p-4 lg:p-6">
          <div class="mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold mt-2">My Library</h1>
            <p class="text-gray-500 mt-2">
              Books and chapters you've purchased.
            </p>
          </div>

          <!-- Credit balance card -->
          <div
            v-if="token"
            class="bg-white rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <span class="text-sm text-gray-500">Credit Balance</span>
              <p class="text-2xl font-bold text-[#093A3F]">
                {{ credits }} credits
              </p>
            </div>
            <div class="flex items-center gap-3">
              <input
                v-model.number="topUpAmount"
                type="number"
                min="10"
                step="10"
                class="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                @click="handleTopUp"
                :disabled="topUpLoading"
                class="px-4 py-2 text-sm font-semibold rounded-xl bg-[#c5a050] text-white hover:bg-[#b8913f] transition disabled:opacity-50"
              >
                {{ topUpLoading ? "Adding..." : "Add Credits" }}
              </button>
            </div>
          </div>

          <!-- Library grid -->
          <div v-if="libraryLoading" class="text-center text-gray-500 py-12">
            Loading your library...
          </div>

          <div
            v-else-if="!token || library.length === 0"
            class="text-center py-16"
          >
            <p class="text-gray-500 text-lg">
              {{ token ? "No purchased books yet." : "Sign in to see your library." }}
            </p>
            <router-link
              v-if="!token"
              to="/login"
              class="inline-block mt-4 px-6 py-2 bg-[#093A3F] text-white rounded-xl text-sm font-semibold"
            >
              Sign In
            </router-link>
          </div>

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            <div
              v-for="book in library"
              :key="book.id"
              @click="goToBook(book.id)"
              class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <div class="aspect-2/3 bg-gray-100 overflow-hidden">
                <img
                  :src="resolveCoverUrl(book.coverImageUrl)"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  @error="
                    ($event.target as HTMLImageElement).src =
                      'https://placehold.co/320x480?text=Book+Cover'
                  "
                  alt="Book cover"
                />
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 truncate">
                  {{ book.title }}
                </h3>
                <p
                  v-if="book.author?.name"
                  class="text-sm text-gray-500 truncate mt-1"
                >
                  {{ book.author.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
