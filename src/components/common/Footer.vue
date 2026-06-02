<template>
  <footer v-if="isExchangePage" class="bg-white border-gray-200 py-8 px-6 text-gray-500 text-sm flex justify-between mt-auto">
    <div class="max-w-7xl mx-auto px-6 md:p-10 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex flex-col items-center md:items-start gap-1">
        <h2 class="text-[#8B5CF6]! font-bold text-xl font-sans tracking-wider">តោះអានសៀវភៅ</h2>
        <p class="text-gray-500 text-sm">© {{ currentYear }} តោះអានសៀវភៅ. All rights reserved.</p>
      </div>

      <div class="flex flex-wrap justify-center gap-6 md:gap-10 text-gray-500 text-sm font-medium">
          <router-link to="/terms" class="hover:text-[#6D28D9] transition-colors">Term of Service</router-link>
          <router-link to="/privacy" class="hover:text-[#6D28D9] transition-colors">Privacy Policy</router-link>
          <router-link to="/contact" class="hover:text-[#6D28D9] transition-colors">Contact Us</router-link>
          <router-link to="/help" class="hover:text-[#6D28D9] transition-colors">Help Center</router-link>
      </div>

      <div class="flex gap-3">
        <button class="w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors aria-label">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
        </button>
        <button class="w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors aria-label">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </button>
      </div>
    </div>
  </footer>
  <footer v-else class="bg-[#093A3F] text-[#FDE9D0] mt-auto">
    <div class="max-w-7xl mx-auto px-8 pt-16 pb-8">

      <!-- Top grid -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr]">

        <!-- Brand column -->
        <div class="flex flex-col gap-4">
          <router-link to="/" class="inline-flex items-center gap-2 no-underline">
            <span class="text-[22px] leading-none">
                <img :src="Icon" alt="Icon">
            </span>
            <span class="font-serif text-xl text-[#FDE9D0] tracking-wide">KDRC</span>
          </router-link>

          <p class="font-sans text-sm leading-relaxed text-[#FDE9D0]/55 max-w-sm text-left">
            The digital sanctuary of Khmer literature. Bridging centuries of ancient
            storytelling with a modern community of writers and readers.
          </p>

          <!-- Socials -->
          <div class="flex gap-2.5 mt-1">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              class="w-9 h-9 rounded-lg bg-[#FDE9D0]/8 border border-[#FDE9D0]/10 flex items-center justify-center text-[#FDE9D0]/60 hover:bg-[#F9AE5B]/15 hover:text-[#F9AE5B] hover:border-[#F9AE5B]/20 transition-all duration-150 no-underline"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4" v-html="social.icon" fill="currentColor"></svg>
            </a>
          </div>
        </div>

        <!-- Link columns -->
        <div class="grid grid-cols-3 gap-12">
          <div v-for="col in footerCols" :key="col.title">
            <h4 class="font-sans text-[11px] font-medium tracking-[1px] uppercase text-[#F9AE5B] mb-4">
              {{ col.title }}
            </h4>
            <ul class="list-none p-0 m-0 flex flex-col gap-2.5">
              <li v-for="link in col.links" :key="link.label">
                <router-link
                  :to="link.path"
                  class="font-sans text-sm text-[#FDE9D0]/55 no-underline hover:text-[#FDE9D0] transition-colors duration-150"
                >
                  {{ link.label }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <!-- Divider -->
      <div class="h-px bg-[#FDE9D0]/8 my-10"></div>

      <!-- Bottom row -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p class="font-sans text-[13px] text-[#FDE9D0]/35">
          © {{ currentYear }} KDRC — Khmer Digital Reading Community. All rights reserved.
        </p>
        <div class="flex gap-5">
          <router-link
            v-for="link in bottomLinks"
            :key="link.label"
            :to="link.path"
            class="font-sans text-[13px] text-[#FDE9D0]/35 no-underline hover:text-[#FDE9D0]/70 transition-colors duration-150"
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Icon from '../../assets/images/Icon.png'
import { computed } from 'vue'

const route = useRoute()
const isExchangePage = computed(() => route.path.startsWith('/exchange-v2'))

const currentYear = new Date().getFullYear()

const socials = [
  {
    label: 'Facebook',
    href: '#',
    icon: '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>',
  },
  {
    label: 'Telegram',
    href: '#',
    icon: '<path d="M21.198 2.433a2.242 2.242 0 00-1.022.215l-16.5 7a2.25 2.25 0 00.264 4.145l3.91 1.27 1.757 5.828a.75.75 0 001.374.15l2.165-3.605 4.33 3.205a2.25 2.25 0 003.497-1.624l2.25-16.5a2.25 2.25 0 00-2.025-2.084z"/>',
  },
  {
    label: 'Instagram',
    href: '#',
    icon: '<rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>',
  },
]

const footerCols = [
  {
    title: 'Explore',
    links: [
      { label: 'Browse Books',    path: '/explore'              },
      { label: 'Classic Khmer',   path: '/explore'},
      { label: 'Fiction',         path: '/explore'},
      { label: 'Education',       path: '/explore'   },
      { label: 'Free Books',      path: '/explore'   },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Discussions',  path: '/community' },
      { label: 'Book Exchange', path: '/exchange' },
      // { label: 'Writers',      path: '/writers'   },
      // { label: 'Start Writing', path: '/write'    },
    ],
  },
  {
    title: 'Support',
    links: [
      // { label: 'About KDRC',    path: '/about'   },
      // { label: 'FAQ',           path: '/faq'     },
      // { label: 'Contact Us',    path: '/contact' },
      // { label: 'Privacy Policy',path: '/privacy' },
      // { label: 'Terms of Use',  path: '/terms'   },
    ],
  },
]

const bottomLinks: Array<{ label: string; path: string }> = [
  // { label: 'Privacy', path: '/privacy' },
  // { label: 'Terms',   path: '/terms'   },
  // { label: 'Contact', path: '/contact' },
]
</script>