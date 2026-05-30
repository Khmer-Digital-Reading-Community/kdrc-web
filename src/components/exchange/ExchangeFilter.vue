
<template>
    <div class="relative w-full max-w-lg">
        <!-- Icon Wrapper: Perfectly centers the icon vertically -->
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
            <!-- Input: Fixed height and left padding to clear the icon -->
        <input
            v-model="searchQuery"
            @input="triggerSearch"
            type="text"
            placeholder="Search for books, authors, or genres..."
            class="w-full h-12 pl-12 pr-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent outline-none transition-all text-gray-700"
        />
    </div>
</template>

<script setup lang="ts">
import { useExchangeSearch } from '../../composables/useExchangeSearch';
const { searchQuery, triggerSearch } = useExchangeSearch();
</script>