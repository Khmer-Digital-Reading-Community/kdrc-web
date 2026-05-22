<template>
    <div class="relative">
        <button
            @click="isOpen = !isOpen"
            :class="[
                'px-4 py-2 rounded-[12px] font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap',
                'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-[#B4690E] focus:ring-offset-2'
            ]"
            title="Sort results"
        >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            <span class="hidden sm:inline">Sort</span>
            <svg
                :class="[
                    'w-4 h-4 transition-transform duration-200',
                    isOpen ? 'transform rotate-180' : ''
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </button>

        <!-- Dropdown Menu -->
        <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div
                v-if="isOpen"
                class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-[12px] shadow-lg z-50 overflow-hidden"
                @click.stop
            >
                <!-- Sort Options Group -->
                <div>
                    <p class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                        Sort By
                    </p>
                    <button
                        v-for="option in sortOptions"
                        :key="option.value"
                        @click="selectSort(option.value)"
                        :class="[
                            'w-full text-left px-4 py-3 transition-colors flex items-center gap-3',
                            selectedSort === option.value
                                ? 'bg-orange-50 text-[#B4690E] font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                        ]"
                    >
                        <span v-if="selectedSort === option.value" class="flex-shrink-0">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </span>
                        <span v-else class="flex-shrink-0 w-4"></span>
                        <div class="flex-grow">
                            <div class="font-medium">{{ option.label }}</div>
                            <div class="text-xs text-gray-500">{{ option.description }}</div>
                        </div>
                    </button>
                </div>
            </div>
        </Transition>

        <!-- Backdrop -->
        <div
            v-if="isOpen"
            class="fixed inset-0 z-40"
            @click="isOpen = false"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export type SortOption = 'recent' | 'popular' | 'trending' | 'rating';

interface SortOptionConfig {
    value: SortOption;
    label: string;
    description: string;
}

const props = defineProps<{
    modelValue: SortOption;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: SortOption];
}>();

const isOpen = ref(false);
const selectedSort = ref<SortOption>(props.modelValue);

const sortOptions: SortOptionConfig[] = [
    {
        value: 'recent',
        label: 'Most Recent',
        description: 'Newly published books first',
    },
    {
        value: 'popular',
        label: 'Most Popular',
        description: 'Most viewed books first',
    },
    {
        value: 'trending',
        label: 'Trending',
        description: 'Rising in popularity',
    },
    {
        value: 'rating',
        label: 'Highest Rated',
        description: 'Best reviewed books first',
    },
];

const selectSort = (value: SortOption) => {
    selectedSort.value = value;
    emit('update:modelValue', value);
    isOpen.value = false;
};

// Watch for external changes to modelValue
defineExpose({
    isOpen,
});
</script>
