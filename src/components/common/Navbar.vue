<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import icon from '../../assets/images/Icon.png'
import Profile from '../../assets/images/Profile.png'
import NotificationIcon from '../../assets/images/NotificationIcon.png'
import ChatIcon from '../../assets/images/ChatIcon.png'
import SearchIcon from '../../assets/images/SearchIcon.png'
import { authState } from '../../auth/useAuth'

const router = useRouter()
const route = useRoute()

const mobileOpen = ref(false)
const langOpen = ref(false)
const currentLang = ref('EN')

const props = defineProps<{ forceAuth?: boolean }>()
const isAuthed = computed(() => props.forceAuth ?? Boolean(authState.token.value))

const navLinks = [
    { label: 'Browse', path: '/browse' },
    { label: 'Community', path: '/community' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
]

const languages = [
    { code: 'EN', label: 'English' },
    { code: 'KH', label: 'ខ្មែរ' },
]

function selectLang(code: string) {
    currentLang.value = code
    langOpen.value = false
}

function handleLogout() {
    authState.token.value = null
    router.push('/login')
}
</script>

<template>
    <nav class="w-full bg-[#093A3F] border-b border-gray-700">
        <div v-if="isAuthed" class="w-full px-6 py-4 flex flex-wrap items-center justify-between gap-6">
            <div class="flex items-center gap-8">
                <router-link to="/home" class="flex items-center gap-2 no-underline">
                    <span class="inline-flex items-center justify-start">
                        <img :src="icon" alt="KDRC logo" class="w-7 h-5" />
                    </span>
                    <span class="text-white text-2xl font-bold font-['Manrope'] leading-8">KDRC</span>
                </router-link>

                <div class="hidden lg:flex items-center gap-6">
                    <router-link
                        v-for="link in navLinks"
                        :key="link.label"
                        :to="link.path"
                        class="text-sm font-normal font-['Manrope'] leading-5 transition-colors"
                        :class="route.path === link.path ? 'text-white font-bold border-b border-white/70 pb-1' : 'text-white/70 hover:text-white'"
                    >
                        {{ link.label }}
                    </router-link>
                </div>
            </div>

            <div class="w-72 h-10 relative">
                <div class="w-72 h-10 left-0 top-0 absolute bg-white rounded-md overflow-hidden">
                      <div class="w-60 h-5 left-[49.5px] top-2.5 absolute overflow-hidden">
                        <div class="w-60 left-0 top-0 absolute justify-center text-black text-base font-normal font-['Inter']">Search title, author, or ISBN...</div>
                    </div>
                </div>
                <div class="h-5 left-4 top-2.5 absolute inline-flex flex-col justify-start items-start">
                    <img :src="SearchIcon" alt="Search" class="w-4 h-4 object-contain" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="px-3 py-1.5 bg-cyan-950 rounded-xl flex items-center gap-2">
                    <div class="w-2 h-2 bg-orange-300 rounded-xl"></div>
                    <div class="inline-flex flex-col justify-start items-start">
                        <div class="w-5 h-4 justify-center text-white text-xs font-bold font-['Inter'] uppercase leading-4 tracking-wider">{{ currentLang }}</div>
                    </div>
                    <button type="button" class="inline-flex flex-col justify-start items-start" @click="langOpen = !langOpen">
                        <div class="w-1.5 h-1 bg-white"></div>
                    </button>
                    <div v-if="langOpen" class="absolute right-40 top-16 z-50 min-w-28 rounded-md bg-[#093A3F] border border-white/10 shadow-lg overflow-hidden">
                        <button
                            v-for="lang in languages"
                            :key="lang.code"
                            type="button"
                            class="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                            @click="selectLang(lang.code)"
                        >
                            {{ lang.label }}
                        </button>
                    </div>
                </div>

                <div class="w-28 inline-flex flex-col justify-start items-start gap-2.5">
                    <div class="self-stretch inline-flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <button type="button" class="inline-flex flex-col justify-start items-start">
                                <img :src="NotificationIcon" alt="Notifications" class="w-4 h-5 object-contain" />
                            </button>
                            <button type="button" @click="handleLogout" class="inline-flex flex-col justify-start items-start">
                                <img :src="ChatIcon" alt="Chat" class="w-5 h-5 object-contain" />
                            </button>
                        </div>

                        <div class="w-10 h-10 relative bg-stone-200 rounded-3xl outline outline-neutral-300/20 -outline-offset-1 overflow-hidden">
                            <img class="w-10 h-10 left-0 top-0 absolute object-cover" :src="Profile" alt="User avatar" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="max-w-7xl mx-auto px-6 h-16 flex items-center">
            <router-link to="/" class="flex items-center gap-2 no-underline mr-8">
                <span class="text-2xl">
                    <img :src="icon" alt="Icon">
                </span>
                <span class="text-[#FDE9D0] text-xl tracking-wide">KDRC</span>
            </router-link>

            <div class="hidden md:flex gap-8">
                <router-link
                    v-for="link in navLinks"
                    :key="link.label"
                    :to="link.path"
                    class="text-[#FDE9D0]/70 hover:text-[#FDE9D0] transition-colors flex items-center"
                    :class="route.path === link.path ? 'text-[#F9AE5B] border-[#F9AE5B]' : 'text-gray-300 border-transparent hover:text-white'"
                >
                    {{ link.label }}
                </router-link>
            </div>

            <div class="hidden md:flex items-center gap-4 ml-auto">
                <div class="relative">
                    <button
                        @click="langOpen = !langOpen"
                        class="flex items-center gap-2 bg-[#0d4d54] px-3 py-1.5 rounded-full hover:bg-[#0a3f45] transition-colors"
                    >
                        <span class="w-2 h-2 rounded-full bg-[#F9AE5B]"></span>
                        <span class="text-[#FDE9D0] text-sm">{{ currentLang }}</span>
                        <svg class="w-3.5 h-3.5 text-[#FDE9D0]/70" :class="{ 'rotate-180': langOpen }" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                            <path d="M4 6l4 4 4-4" />
                        </svg>
                    </button>

                    <div v-if="langOpen" class="absolute top-full right-0 mt-2 bg-[#0d4d54] rounded-md shadow-lg py-1 min-w-25 border border-[#FDE9D0]/10 z-50">
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

                <template v-if="isAuthed">
                    <button @click="handleLogout" class="text-[#FDE9D0] text-sm font-medium border border-[#FDE9D0]/30 px-5 py-1.5 rounded hover:bg-[#FDE9D0]/10 transition-colors">
                        Logout
                    </button>
                </template>

                <template v-else>
                    <router-link to="/login" class="text-[#FDE9D0] text-sm font-medium border border-[#FDE9D0]/30 px-5 py-1.5 rounded hover:bg-[#FDE9D0]/10 transition-colors">
                        Login
                    </router-link>

                    <router-link to="/signup" class="bg-[#F9AE5B] text-[#093A3F] text-sm font-medium px-5 py-1.5 rounded hover:opacity-90 transition-opacity">
                        Sign Up
                    </router-link>
                </template>
            </div>

            <button class="md:hidden text-[#FDE9D0]" @click="mobileOpen = !mobileOpen">
                Menu
            </button>
        </div>

        <div v-if="mobileOpen && !isAuthed" class="md:hidden bg-[#0d4d54] px-6 py-4 flex flex-col gap-4 absolute w-full border-b border-[#FDE9D0]/10 z-40">
            <router-link
                v-for="link in navLinks"
                :key="link.label"
                :to="link.path"
                class="text-[#FDE9D0]/70 hover:text-[#FDE9D0]"
            >
                {{ link.label }}
            </router-link>

            <hr class="border-[#FDE9D0]/10 my-2" />

            <div class="flex flex-col gap-3">
                <template v-if="isAuthed">
                    <button @click="handleLogout" class="text-center text-[#FDE9D0] border border-[#FDE9D0]/30 py-2 rounded hover:bg-[#FDE9D0]/10">Logout</button>
                </template>
                <template v-else>
                    <router-link to="/login" class="text-center text-[#FDE9D0] border border-[#FDE9D0]/30 py-2 rounded hover:bg-[#FDE9D0]/10">Login</router-link>
                    <router-link to="/signup" class="text-center bg-[#F9AE5B] text-[#093A3F] font-medium py-2 rounded hover:opacity-90">Sign Up</router-link>
                </template>
            </div>
        </div>
    </nav>
</template>