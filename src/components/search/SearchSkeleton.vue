<template>
    <div :class="[
        'bg-white rounded-[24px] border border-gray-100 animate-pulse',
        isListView ? 'rounded-[16px] p-4 md:p-6 flex gap-4 md:gap-6' : 'overflow-hidden flex flex-col h-full'
    ]">
        <!-- Grid/Card Skeleton -->
        <template v-if="!isListView">
            <div class="h-[240px] md:h-[300px] w-full bg-gray-200 rounded-t-[8px] md:rounded-t-[12px]"></div>
            <div class="p-5 md:p-8 flex flex-col flex-grow">
                <div class="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                <div class="space-y-2 mb-4">
                    <div class="h-3 bg-gray-200 rounded"></div>
                    <div class="h-3 bg-gray-200 rounded"></div>
                    <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div class="flex gap-2 mt-auto pt-4">
                    <div class="h-6 w-16 bg-gray-200 rounded"></div>
                    <div class="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
        </template>

        <!-- List Skeleton -->
        <template v-else>
            <div class="flex-shrink-0 w-24 md:w-32 h-32 md:h-40 bg-gray-200 rounded-[12px]"></div>
            <div class="flex-grow py-2 space-y-3">
                <div class="h-6 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                <div class="space-y-2">
                    <div class="h-3 bg-gray-200 rounded"></div>
                    <div class="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
                <div class="flex gap-2 pt-2">
                    <div class="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    isListView?: boolean;
}>();
</script>
