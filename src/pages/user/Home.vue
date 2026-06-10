<template>
  <div class="home-page min-h-screen bg-[var(--home-paper)] overflow-x-hidden">
    <Hero />
    <Book_collection />
    <Reading_continue />
    <History />
    <Explore />
    <Recommend />

    <!-- Quick CTA strip -->
    <section
      ref="ctaRef"
      class="reveal-on-scroll mx-4 md:mx-8 lg:mx-auto max-w-[1280px] mb-16"
    >
      <div
        class="relative overflow-hidden rounded-3xl px-8 py-12 md:py-14 text-center
               bg-gradient-to-br from-[#012D1D] via-[#1B4332] to-[#2d6a4f]
               shadow-xl shadow-[#012D1D]/20"
      >
        <div
          class="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden="true"
        >
          <div
            class="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#c5a050]/30 blur-3xl"
          />
          <div
            class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-2xl"
          />
        </div>
        <p
          class="relative text-[11px] font-bold tracking-[0.2em] text-[#c5a050] uppercase mb-3"
        >
          Join the community
        </p>
        <h2
          class="relative font-['Playfair_Display',Georgia,serif] text-2xl md:text-3xl font-bold text-white mb-3"
        >
          Your next story is waiting
        </h2>
        <p class="relative text-white/70 text-sm max-w-md mx-auto mb-8">
          Discover thousands of titles, track your progress, and share your own
          writing with readers worldwide.
        </p>
        <div class="relative flex flex-wrap justify-center gap-3">
          <router-link
            to="/explore"
            class="inline-flex items-center gap-2 bg-[#c5a050] hover:bg-[#d4b35c] text-[#012D1D]
                   font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300
                   hover:scale-[1.02] hover:shadow-lg"
          >
            Explore Library
          </router-link>
          <router-link
            :to="writeTarget"
            class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white
                   font-semibold text-sm px-6 py-3 rounded-xl border border-white/25
                   backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
          >
            Start Writing
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Book_collection from '../../components/home/Book_collection.vue';
import Hero from '../../components/home/Hero.vue';
import Explore from '../../components/home/Explore.vue';
import Reading_continue from '../../components/home/Reading_continue.vue';
import History from '../../components/home/History.vue';
import Recommend from '../../components/home/Recommend.vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import { token } from '../../stores/useAuth';
import '../../assets/style/home.css';

const ctaRef = ref<HTMLElement | null>(null);
useScrollReveal(ctaRef);

const writeTarget = computed(() =>
  token.value ? '/dashboard/books/new' : '/login?redirect=/dashboard/books/new',
);
</script>
