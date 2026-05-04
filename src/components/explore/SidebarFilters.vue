<template>
  <div class="flex flex-col gap-10">
    <div>
      <h3 class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B4690E] mb-4">Categories</h3>
      <div class="flex flex-col gap-1">
        <button v-for="cat in categories" :key="cat"
          :class="activeCat === cat ? 'bg-[#1c3a2e] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'"
          class="w-full text-left px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all"
          @click="activeCat = cat">
          {{ cat }}
        </button>
      </div>
    </div>

    <div>
      <h3 class="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Format</h3>
      <div class="flex gap-2">
        <button class="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-bold bg-white hover:border-[#B4690E]">E-book</button>
        <button class="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-bold bg-white hover:border-[#B4690E]">Physical</button>
      </div>
    </div>

    <div>
      <h3 class="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Language</h3>
      <div class="flex flex-col gap-3">
        <div v-for="lang in languages" :key="lang.name" class="flex justify-between text-sm group cursor-pointer">
          <span class="text-gray-600 group-hover:text-black">{{ lang.name }}</span>
          <span class="text-gray-400 font-mono text-[11px]">{{ lang.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const activeCat = ref('Khmer Literature');
const categories = ['Khmer Literature', 'Education', 'Novels', 'Manga', 'Sci-Fi'];
const languages = [
  { name: 'Khmer', count: '1,240' },
  { name: 'English', count: '850' },
  { name: 'French', count: '420' }
];
</script>