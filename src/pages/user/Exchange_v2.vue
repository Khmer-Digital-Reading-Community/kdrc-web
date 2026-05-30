<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ExchangeCard from '../../components/exchange/ExchangeCard.vue';
import ExchangeFilter from '../../components/exchange/ExchangeFilter.vue';
import { useExchangeSearch } from '../../composables/useExchangeSearch';
const { selectedCondition, selectedLocation, results, loading, performSearch, clearFilters, changePage, currentPage, totalPages, applyFilters } = useExchangeSearch();

onMounted(() => {
    performSearch();
});

const displayedExchanges = computed(() => results.value);
</script>

<template>
    <div class="bg-[#FAFAFA] min-h-screen pb-20">
        <div class="max-w-7xl mx-auto px-6 pt-12">

            <div class="mb-12">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-1.5 h-10 bg-[#B58E2C] rounded-full"></div>
                        <h1 class="text-4xl font-bold text-gray-900">
                            Exchange <span class="text-[#8B5CF6]">Showcase</span>
                        </h1>
                    </div>
                    <div class="flex items-center gap-3">
                        <router-link
                            :to="{ name: 'exchange-dashboard-v2' }"
                            class="bg-white border border-[#8B5CF6] text-[#8B5CF6] hover:bg-purple-50 px-6 py-2.5 rounded-xl font-medium transition-all"
                        >
                            Trade Center
                        </router-link>
                        <router-link
                            :to="{ name: 'post-exchange' }"
                            class="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl font-medium transition-all"
                        >
                            Post a Book
                        </router-link>
                    </div>
                </div>
                <p class="text-gray-600 max-w-xl text-lg">
                    Explore our curated collection of community book listings. Connect with fellow readers in <span class="font-semibold text-[#B58E2C]">Phnom Penh</span> and swap your favorite stories.
                </p>
            </div>
            <!-- Search Bar Component -->
            <ExchangeFilter />

            <!-- Filter Dropdown -->
            <div class="flex flex-wrap items-center gap-4 mb-2 mt-2">
                <!-- Condition Filter -->
                <div class="relative">
                    <select
                        v-model="selectedCondition"
                        @change="applyFilters"
                        class="appearance-none bg-white border border-gray-200 text-gray-700 h-[42px] pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all cursor-pointer font-medium text-sm"
                    >
                        <option value="">All Conditions</option>
                        <option value="LIKE_NEW">Like New</option>
                        <option value="GOOD">Good</option>
                        <option value="ACCEPTABLE">Acceptable</option>
                        <option value="NEW">New</option>
                    </select>
                    <!-- Custom Chevron Icon -->
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <!-- Location Filter -->
                <div class="relative">
                    <select
                        v-model="selectedLocation"
                        @change="applyFilters"
                        class="appearance-none bg-white border border-gray-200 text-gray-700 h-[42px] pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all cursor-pointer font-medium text-sm"
                    >
                        <option value="">All Locations</option>
                        <option value="Phnom Penh">Phnom Penh</option>
                        <option value="Banteay Meanchey">Banteay Meanchey</option>
                        <option value="Battambang">Battambang</option>
                        <option value="Kampong Cham">Kampong Cham</option>
                        <option value="Kampong Chhnang">Kampong Chhnang</option>
                        <option value="Kampong Speu">Kampong Speu</option>
                        <option value="Kampong Thom">Kampong Thom</option>
                        <option value="Kandal">Kandal</option>
                        <option value="Kep">Kep</option>
                        <option value="Koh Kong">Koh Kong</option>
                        <option value="Kratie">Kratie</option>
                        <option value="Mondulkiri">Mondulkiri</option>
                        <option value="Oddar Meanchey">Oddar Meanchey</option>
                        <option value="Pailin">Pailin</option>
                        <option value="Preah Sihanouk">Preah Sihanouk</option>
                        <option value="Preah Vihear">Preah Vihear</option>
                        <option value="Prey Veng">Prey Veng</option>
                        <option value="Pursat">Pursat</option>
                        <option value="Ratanakiri">Ratanakiri</option>
                        <option value="Siem Reap">Siem Reap</option>
                        <option value="Stung Treng">Stung Treng</option>
                        <option value="Svay Rieng">Svay Rieng</option>
                        <option value="Takeo">Takeo</option>
                        <option value="Tboung Khmum">Tboung Khmum</option>
                    </select>
                    <!-- Custom Chevron Icon -->
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="py-20 text-center text-gray-500">Loading showcase...</div>

            <div v-else>
                <div v-if="results.length === 0" class="flex items-center justify-between gap-4 mb-6 rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                    <span>No exchange listings were returned from the API, so sample listings are shown below.</span>
                    <button @click="clearFilters" class="rounded-lg bg-[#093A3F] px-4 py-2 font-medium text-[#FDE9D0] transition-colors hover:bg-[#0d4d54]">
                        Reset Filters
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
                    <ExchangeCard
                        v-for="book in displayedExchanges"
                        :key="book.id"
                        :book="book"
                    />
                </div>

                <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mb-16">
                    <button
                        @click="changePage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span class="text-gray-700">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <button
                        @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto max-w-7xl mx-auto px-6">
            <div class="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border-gray-100 relative overflow-hidden flex flex-col justify-center">
                <div>
                    <h2 class="text-3xl font-bold text-[#8B5CF6]! mb-2">Join the Community</h2>
                    <p class="text-gray-600">Connect with over 5,000 book lovers in Phnom Penh!. Swap, chat, and share the joy of reading.</p>
                </div>
                <div>
                    <img src="../../assets/images/Overlay.png" alt="overlay" class="absolute right-0 top-0 h-full w-64 translate-x-12 object-cover" />
                </div>
            </div>
            <div class="bg-[#F59E0B] rounded-3xl p-8 text-white shadow-sm flex flex-col justify-center">
                <h2 class="text-5xl font-bold mg-2">12k+</h2>
                <p class="text-[#684000] font-medium text-lg">Successful Exchange</p>
            </div>
        </div>
    </div>
</template>

