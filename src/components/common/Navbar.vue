<script setup lang="ts">
// Import 'ref' from Vue so we can create reactive variables
import { ref } from 'vue'
import icon from '../../assets/images/Icon.png'

// Create a variable to track if the mobile menu is open. It starts as false (closed).
const mobileOpen = ref(false)
const langOpen = ref(false) // Controls the languag dropdown
const currentLang = ref("EN") // Stores the selected language
const activeTab = ref('/browse') // Stores which link id currently active

// Instead of copying and pasting HTML for every link, we store them in an array
const navLinks = [
    { label: 'Browse', path: '/browse' },
    { label: 'Community', path: '/community' },
    { label: 'About', path: '/about' }
]

const languages = [
    { code: 'EN', label: 'English' },
    { code: 'KH', label: 'ខ្មែរ'}
]

function selectLang(code: string) {
    currentLang.value = code // Update the landuage
    langOpen.value = false // Close the dropdown menu
}
</script>
<template>
    <nav class="bg-[#093A3F] w-full h-16 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-6 h-full flex item-center">
            <a href="/" class="flex items-center gap-2 no-underline mr-8">
                <span class="text-2xl">
                    <img :src="icon" alt="Icon">
                </span>
                <span class="text-[#FDE9D0] text-xl tracking-wide">KDRC</span>
            </a>

            <div class="hidden md:flex gap-8">
                <!-- DYNAMIC CLASSES: If the activeTab matches this link's path, make it orange. Otherwise, make it gray. -->
                <a
                v-for="link in navLinks"
                :key="link.label" 
                :href="link.path"
                @click.prevent="activeTab = link.path"
                class="text-[#FDE9D0]/70 hover:text-[#FDE9D0] transition-colors flex items-center"

                :class="activeTab === link.path 
                    ? 'text-[#F9AE5B] border-[#F9AE5B]' 
                    : 'text-gray-300 border-transparent hover:text-white'"
                >
                {{ link.label }}
                </a>
            </div>

            <div class="hidden md:flex items-center gap-4 ml-auto">
                <div class="relative">
                    <button
                        @click="langOpen = !langOpen"
                        class="flex items-center gap-2 bg-[#0d4d54] px-3 py-1.5 rounded-full hover:bg-[#0a3f45] transition-colors"
                    >
                        <span class="w-2 h-2 rounded-full bg-[#F9AE5B]"></span>
                        <span class="text-[#FDE9D0] text-sm">{{ currentLang }}</span>
                        <svg class="w-3.5 h-3.5 text-[#FDE9D0]/70" :class="{'rotate-180': langOpen}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6l4 4 4-4"/></svg>
                </button>

                    <div v-if="langOpen" class="absolute top-full right-0 mt-2 bg-[#0d4d54] rounded-md shadow-lg py-1 min-w-25 border border-[#FDE9D0]/10 z-50 ">
                        <button
                        v-for="lang in languages"
                        :key="lang.code"
                        @click="selectLang(lang.code)"
                        class="w-full text-left px-4 py-2 text-sm text-[#FDE9D0]/70 hover:bg-[#093A3F] hover:text-[#FDE9D0]" 
                        >
                            {{ lang.label }}
                        </button>
                    </div>
                </div>

                <a href="/login" class="text-[#FDE9D0] text-sm font-medium border border-[#FDE9D0]/30 px-5 py-1.5 rounded hover:bg-[#FDE9D0]/10 transition-colors">
                    Login
                </a>
                <a href="/register" class="bg-[#F9AE5B] text-[#093A3F] text-sm font-medium px-5 py-1.5 rounded hover:opacity-90 transition-opacity">
                    Sign Up
                </a>
            </div>

            <button class="md:hidden text-[#FDE9D0]" @click="mobileOpen = !mobileOpen">
                Menu
            </button>
        </div>

        <div v-if="mobileOpen" class="md:hidden bg-[#0d4d54] px-6 py-4 flex flex-col gap-4 absolute w-full border-b border-[#FDE9D0]/10 z-40">
            <a 
                v-for="link in navLinks"
                :key="link.label"
                :href="link.path"
                class="text-[#FDE9D0]/70 hover:text-[#FDE9D0]"
            >
                {{ link.label }}
            </a>

            <hr class="border-[#FDE9D0]/10 my-2" />

            <div class="flex flex-col gap-3">
                <a href="/login" class="text-center text-[#FDE9D0] border broder-[#FDE9D0]/30 py-2 rounded">Login</a>
                <a href="/register" class="text-center bg-[#F9AE5B] text-[#093A3F] font-medium py-2 rounded">Sign Up</a>
            </div>
        </div>
    </nav>
</template>