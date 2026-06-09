<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";
import ReadingListCard from "@/components/communitys/ReadingListCard.vue";
import { useReadingLists } from "../../composables/useReadingLists";
import { token } from "../../services/auth";

const router = useRouter();
const { myLists, publicLists, create } = useReadingLists();

const showCreate = ref(false);
const newName = ref("");
const newDescription = ref("");
const newIsPublic = ref(true);
const createLoading = ref(false);

const handleCreate = async () => {
  if (!newName.value.trim()) return;
  createLoading.value = true;
  try {
    await create({
      name: newName.value.trim(),
      description: newDescription.value.trim() || undefined,
      isPublic: newIsPublic.value,
    });
    newName.value = "";
    newDescription.value = "";
    showCreate.value = false;
  } catch {
    // error handled silently
  } finally {
    createLoading.value = false;
  }
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
        <div class="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-3xl sm:text-4xl font-bold mt-2">
                Reading Lists
              </h1>
              <p class="text-gray-500 mt-2">
                Curated book collections from the community.
              </p>
            </div>
            <button
              v-if="token"
              @click="showCreate = !showCreate"
              class="px-4 py-2 text-sm font-semibold rounded-xl bg-[#093A3F] text-white hover:bg-[#0d2e2c] transition"
            >
              New List
            </button>
          </div>

          <!-- Create form -->
          <div
            v-if="showCreate && token"
            class="bg-white rounded-2xl p-5 mb-8 border border-gray-200"
          >
            <input
              v-model="newName"
              placeholder="List name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-3"
            />
            <textarea
              v-model="newDescription"
              placeholder="Description (optional)"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-3"
            ></textarea>
            <label class="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <input v-model="newIsPublic" type="checkbox" />
              Public
            </label>
            <div class="flex gap-2">
              <button
                @click="handleCreate"
                :disabled="createLoading || !newName.trim()"
                class="px-4 py-2 text-sm font-semibold rounded-xl bg-[#c5a050] text-white hover:bg-[#b8913f] disabled:opacity-50 transition"
              >
                {{ createLoading ? "Creating..." : "Create" }}
              </button>
              <button
                @click="showCreate = false"
                class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- My lists -->
          <section v-if="token && myLists.length > 0" class="mb-10">
            <h2 class="text-lg font-bold text-gray-900 mb-4">My Lists</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ReadingListCard
                v-for="list in myLists"
                :key="list.id"
                :list="list"
                @click="router.push(`/reading-list/${list.id}`)"
              />
            </div>
          </section>

          <!-- Public lists -->
          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-4">
              Community Lists
            </h2>
            <div
              v-if="publicLists.length === 0"
              class="text-center text-gray-500 py-12"
            >
              No public reading lists yet.
            </div>
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <ReadingListCard
                v-for="list in publicLists"
                :key="list.id"
                :list="list"
                @click="router.push(`/reading-list/${list.id}`)"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
