<template>
    <router-link
        :to="`/book-exchange-detail-v2/${exchange.id}`"
        :class="[
            'group block bg-white transition-all duration-300',
            isListView
                ? 'rounded-[16px] border border-gray-100 p-4 md:p-6 flex gap-4 md:gap-6 hover:shadow-lg'
                : 'rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full'
        ]"
    >
        <!-- Grid/Card View -->
        <template v-if="!isListView">
            <div
                class="relative h-[220px] shrink-0 overflow-hidden"
                :style="{ background: getExchangeGradient(exchange.condition) }"
            >
                <img
                    v-if="exchange.coverImage"
                    :src="exchange.coverImage"
                    :alt="exchange.title"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                    v-else
                    class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4"
                >
                    <svg
                        class="w-14 h-14 text-white/60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                    </svg>
                    <span class="text-white/80 text-xs font-semibold text-center line-clamp-2 max-w-[140px]">
                        {{ exchange.title }}
                    </span>
                </div>

                <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />

                <!-- Condition Badge -->
                <span
                    class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white border border-white/30"
                >
                    {{ exchange.condition }}
                </span>

                <!-- Exchange Type Badge -->
                <div
                    class="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border"
                    :class="exchange.exchangeType === 'Sell'
                        ? 'bg-green-500/20 backdrop-blur-sm text-white border-white/30'
                        : 'bg-amber-500/20 backdrop-blur-sm text-white border-white/30'"
                >
                    <svg v-if="exchange.exchangeType === 'Sell'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    {{ exchange.exchangeType === 'Sell' ? 'Sell' : 'Trade' }}
                </div>
            </div>

            <div class="flex flex-col flex-grow p-5">
                <h3 class="text-[16px] font-bold text-[#093A3F] leading-snug line-clamp-2 group-hover:text-[#B4690E] transition-colors mb-1">
                    {{ exchange.title }}
                </h3>

                <p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                    By {{ exchange.author }}
                </p>

                <p class="text-[13px] text-gray-500 leading-relaxed line-clamp-3 flex-grow mb-4">
                    {{ exchange.description }}
                </p>

                <!-- Meta row -->
                <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span class="flex items-center gap-1 text-[11px] text-gray-500">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {{ exchange.location }}
                    </span>

                    <span
                        v-if="exchange.exchangeType === 'Sell' && exchange.price"
                        class="text-[13px] font-bold text-[#B4690E]"
                    >
                        ${{ Number(exchange.price).toFixed(2) }}
                    </span>
                    <span
                        v-else
                        class="text-[12px] font-bold text-[#B4690E]"
                    >
                        View →
                    </span>
                </div>
            </div>
        </template>

        <!-- List View -->
        <template v-else>
            <div
                class="flex-shrink-0 w-24 md:w-32 h-32 md:h-40 flex items-center justify-center relative overflow-hidden rounded-[12px]"
                :style="{ background: getExchangeGradient(exchange.condition) }"
            >
                <img
                    v-if="exchange.coverImage"
                    :src="exchange.coverImage"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    :alt="exchange.title"
                />
                <svg
                    v-else
                    class="w-10 h-10 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            </div>

            <div class="flex-grow flex flex-col justify-between py-2">
                <div>
                    <div class="flex items-start justify-between gap-3 mb-2">
                        <h3 class="text-[16px] md:text-[18px] font-bold text-[#093A3F] group-hover:text-[#B4690E] transition-colors line-clamp-2">
                            {{ exchange.title }}
                        </h3>
                        <div class="flex items-center gap-2 shrink-0">
                            <span
                                class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                :class="exchange.exchangeType === 'Sell'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'"
                            >
                                {{ exchange.exchangeType === 'Sell' ? 'Sell' : 'Trade' }}
                            </span>
                        </div>
                    </div>

                    <p class="text-[13px] text-gray-600 font-semibold mb-2">
                        By {{ exchange.author }}
                    </p>

                    <p class="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {{ exchange.description }}
                    </p>
                </div>

                <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-[#FDE9D0] text-[#B4690E] text-[11px] font-bold rounded-md uppercase tracking-wider">
                        {{ exchange.condition }}
                    </span>
                    <span class="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {{ exchange.location }}
                    </span>
                    <span
                        v-if="exchange.exchangeType === 'Sell' && exchange.price"
                        class="px-3 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-md uppercase tracking-wider"
                    >
                        ${{ Number(exchange.price).toFixed(2) }}
                    </span>
                </div>
            </div>
        </template>
    </router-link>
</template>

<script setup lang="ts">
import type { ExchangeResult } from '../../services/searchApi';

defineProps<{
    exchange: ExchangeResult;
    isListView?: boolean;
}>();

function getExchangeGradient(condition?: string) {
    const gradients: Record<string, string> = {
        'New': 'linear-gradient(135deg, #1C6B4F 0%, #0d4a36 100%)',
        'Like New': 'linear-gradient(135deg, #2D7D6F 0%, #1a5c52 100%)',
        'Good': 'linear-gradient(135deg, #3D6B8F 0%, #254a63 100%)',
        'Fair': 'linear-gradient(135deg, #8F6B3D 0%, #634a25 100%)',
        'Poor': 'linear-gradient(135deg, #8F3D3D 0%, #632525 100%)',
    };

    return (
        gradients[condition || ''] ??
        'linear-gradient(135deg, #6B4F8F 0%, #3d2563 100%)'
    );
}
</script>
