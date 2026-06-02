<script setup lang="ts">
import { computed } from 'vue';
import literatureImage from '../../assets/images/Literature.png';
import writingImage from '../../assets/images/Writing.png';
import { token } from '../../stores/useAuth';

const readPath = '/explore';
const writePath = computed(() =>
  token.value ? '/dashboard/books/new' : '/login?redirect=/dashboard/books/new',
);

const stats = [
  { value: '10K+', label: 'Titles' },
  { value: '2K+', label: 'Authors' },
  { value: 'Free', label: 'To read' },
];
</script>

<template>
  <section class="hero-mesh relative overflow-hidden border-b border-[#e8e4dc]/60">
    <!-- Decorative grid -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.04]"
      aria-hidden="true"
      style="
        background-image: linear-gradient(#012d1d 1px, transparent 1px),
          linear-gradient(90deg, #012d1d 1px, transparent 1px);
        background-size: 48px 48px;
      "
    />

    <div
      class="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14 md:py-20 lg:py-24
             flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
    >
      <!-- Copy -->
      <div class="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
        <p
          class="hero-enter hero-enter-d1 inline-flex items-center gap-2
                 text-[11px] font-bold tracking-[0.18em] uppercase text-[#735C00]
                 bg-white/60 backdrop-blur-sm border border-[#e8e4dc] rounded-full
                 px-4 py-1.5 mb-6"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#c5a050] animate-pulse" />
          Khmer Digital Reading Community
        </p>

        <h1
          class="hero-enter hero-enter-d2 font-['Playfair_Display',Georgia,serif]
                 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.12] tracking-tight"
        >
          <span class="text-[#012D1D]">Read, Write, and</span>
          <br />
          <span
            class="bg-gradient-to-r from-[#735C00] via-[#c5a050] to-[#735C00]
                   bg-clip-text text-transparent bg-[length:200%_auto]
                   animate-[home-shimmer_4s_linear_infinite]"
          >
            Share Stories.
          </span>
        </h1>

        <p
          class="hero-enter hero-enter-d3 mt-5 text-[#524131]/90 text-base leading-relaxed
                 max-w-lg mx-auto lg:mx-0"
        >
          A curated sanctuary for the literary mind — from classical manuscripts
          to contemporary drafts. Discover a community built on the craft of the
          written word.
        </p>

        <div
          class="hero-enter hero-enter-d4 mt-8 flex flex-col sm:flex-row gap-3
                 justify-center lg:justify-start"
        >
          <router-link
            :to="readPath"
            class="group inline-flex items-center justify-center gap-2
                   bg-gradient-to-r from-[#012D1D] to-[#1B4332] text-white
                   text-sm font-bold px-8 py-3.5 rounded-xl
                   shadow-lg shadow-[#012D1D]/25
                   transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                   hover:from-[#1B4332] hover:to-[#2d6a4f]"
          >
            Start Reading
            <svg
              class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </router-link>
          <router-link
            :to="writePath"
            class="group inline-flex items-center justify-center gap-2
                   bg-[#c5a050] hover:bg-[#d4b35c] text-[#012D1D]
                   text-sm font-bold px-8 py-3.5 rounded-xl
                   shadow-md shadow-[#c5a050]/30
                   transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Start Writing
            <svg
              class="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </router-link>
        </div>

        <!-- Mini stats -->
        <div
          class="hero-enter hero-enter-d4 mt-10 flex flex-wrap justify-center lg:justify-start
                 gap-6 sm:gap-10"
        >
          <div v-for="stat in stats" :key="stat.label" class="text-center lg:text-left">
            <p class="text-2xl font-bold text-[#012D1D] font-['Playfair_Display',serif]">
              {{ stat.value }}
            </p>
            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>

      <!-- Visual -->
      <div class="hero-enter hero-enter-d3 relative flex-shrink-0 w-full max-w-md lg:max-w-lg">
        <div
          class="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#c5a050]/20
                 to-[#1B4332]/10 blur-2xl"
          aria-hidden="true"
        />
        <div class="relative hero-float">
          <img
            :src="literatureImage"
            alt="Literature and books"
            class="w-full h-auto rounded-3xl shadow-2xl shadow-[#012D1D]/15
                   ring-1 ring-white/80 object-cover"
          />
          <img
            :src="writingImage"
            alt="Writing"
            class="absolute -bottom-4 -left-4 sm:-left-8 w-24 sm:w-28 h-auto
                   rounded-xl border-4 border-white shadow-xl
                   -rotate-6 hover:rotate-0 transition-transform duration-500"
          />
        </div>
        <!-- Floating badge -->
        <div
          class="absolute top-4 right-2 sm:right-0 bg-white/95 backdrop-blur-md
                 border border-[#e8e4dc] rounded-2xl px-4 py-3 shadow-lg
                 animate-[home-fade-in_1s_ease_0.6s_both]"
        >
          <p class="text-[10px] font-bold text-[#c5a050] uppercase tracking-wider">
            Live now
          </p>
          <p class="text-sm font-bold text-[#012D1D] mt-0.5">New chapters daily</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import '../../assets/style/home.css';
</style>
