<template>
    <div class="flex items-center gap-3 mb-6">
        <!-- Icon -->
        <div
            :class="[
                'w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0',
                icon === 'exchange'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-[#FDE9D0] text-[#B4690E]'
            ]"
        >
            <!-- Book icon -->
            <svg
                v-if="icon === 'book'"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
            </svg>

            <!-- Exchange icon -->
            <svg
                v-else-if="icon === 'exchange'"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
            </svg>
        </div>

        <!-- Title -->
        <h2 class="text-xl md:text-2xl font-bold text-[#093A3F]">
            {{ title }}
        </h2>

        <!-- Count Badge -->
        <span
            v-if="count >= 0"
            :class="[
                'px-3 py-1 rounded-full text-xs font-bold',
                icon === 'exchange'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-[#FDE9D0] text-[#B4690E]'
            ]"
        >
            {{ count }}
        </span>

        <!-- Loading dot when count unknown -->
        <span
            v-else
            class="w-6 h-6 rounded-full bg-gray-200 animate-pulse"
        ></span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    /** Number of results. Use -1 for loading state (shows pulsing dot). */
    count: number;
    icon: 'book' | 'exchange';
}>();
</script>
