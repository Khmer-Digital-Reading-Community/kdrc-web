<script setup lang="ts">
import { ref } from "vue";

import BookHero from "@/components/bookdetail/BookHero.vue";
import ChapterList from "@/components/bookdetail/ChapterList.vue";
import BookTabs from "@/components/bookdetail/BookTabs.vue";
import ReviewSection from "@/components/bookdetail/ReviewSection.vue";
import AuthorSection from "@/components/bookdetail/AuthorSection.vue";

import { useBookDetail } from "../../composables/useBookDetails";

const activeTab = ref<"author" | "reviews">(
  "reviews"
);

//const { book, loading } = useBookDetail();

// Mock data for testing without API
const loading = ref(false);

const book = ref({
  id: "1",

  title: "The Whispering Vellum",

  description:
    "A journey through forgotten temples and ancient Khmer wisdom.",

  coverImage:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f",

  language: "English",

  pages: 342,

  publisher: "Atelier Press",

  rating: 4.8,

  reviewCount: 1248,

  author: {
    name: "Elias Thorne",

    bio:
      "Elias Thorne writes literary fantasy centered around memory, architecture, and silence. His work has been translated into 14 languages.",

    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },

  chapters: [
    {
      id: "1",
      title: "The Last Library",
      duration: "12 min read",
      isPremium: false,
      isPublic: true,
    },

    {
      id: "2",
      title: "Ink Between Stones",
      duration: "18 min read",
      isPremium: true,
      isPublic: false,
    },

    {
      id: "3",
      title: "The Quiet Cathedral",
      duration: "14 min read",
      isPremium: true,
      isPublic: false,
    },
  ],

  reviews: [
    {
      id: "1",
      userName: "Sophia Bennett",

      userImg:
        "https://randomuser.me/api/portraits/women/44.jpg",

      date: "May 18, 2026",

      title: "Beautifully Written",

      comment:
        "The prose feels cinematic and deeply emotional. Every chapter unfolds like architecture.",

      helpfulCount: 18,
    },

    {
      id: "2",
      userName: "Daniel Gray",

      userImg:
        "https://randomuser.me/api/portraits/men/32.jpg",

      date: "May 16, 2026",

      title: "A Modern Masterpiece",

      comment:
        "Rarely does fantasy literature feel this intimate and intelligent.",

      helpfulCount: 9,
    },
  ],
});
</script>

<template>
  <div
    class="bg-[#f9fafb]
            text-gray-800
            font-sans
            antialiased
            min-h-screen
            flex flex-col"
  >

    <div
      v-if="loading"
      class="flex-1 flex items-center justify-center"
    >
      <p class="text-gray-500">
        Loading book details...
      </p>
    </div>

    <main
      v-else-if="book"
      class="max-w-screen-2xl
              mx-auto
              px-4 sm:px-8 lg:px-12
              py-10 md:py-16
              w-full flex-1"
    >

      <nav
        class="text-xs text-gray-500
                mb-8 font-medium"
      >

        <RouterLink
          to="/explore"
          class="hover:text-gray-900 transition"
        >
          Explore
        </RouterLink>

        <span class="mx-1">
          >
        </span>

        <span class="text-gray-400">
          Book Details
        </span>

      </nav>

      <BookHero :book="book" />

      <ChapterList
        :chapters="book.chapters"
      />

      <div class="mt-24">

        <BookTabs
          :activeTab="activeTab"
          @change-tab="activeTab = $event"
        />

        <ReviewSection
          v-if="activeTab === 'reviews'"
          :reviews="book.reviews"
          :rating="book.rating"
          :reviewCount="book.reviewCount"
        />

        <AuthorSection
          v-else
          :author="book.author"
        />

      </div>

    </main>

    <div
      v-else
      class="flex-1 flex items-center justify-center"
    >

      <p class="text-gray-500">
        Book not found.
      </p>

    </div>

  </div>
</template>