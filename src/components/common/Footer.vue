<template>
  <footer class="bg-[#093A3F] text-[#FDE9D0] mt-auto">
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
import Icon from '../../assets/images/Icon.png'
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
      { label: 'Browse Books',    path: '/browse'              },
      { label: 'Classic Khmer',   path: '/browse?genre=classic'},
      { label: 'Fiction',         path: '/browse?genre=fiction'},
      { label: 'Education',       path: '/browse?genre=edu'   },
      { label: 'Free Books',      path: '/browse?type=free'   },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Discussions',  path: '/community' },
      { label: 'Book Exchange', path: '/exchange' },
      { label: 'Writers',      path: '/writers'   },
      { label: 'Start Writing', path: '/write'    },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'About KDRC',    path: '/about'   },
      { label: 'FAQ',           path: '/faq'     },
      { label: 'Contact Us',    path: '/contact' },
      { label: 'Privacy Policy',path: '/privacy' },
      { label: 'Terms of Use',  path: '/terms'   },
    ],
  },
]

const bottomLinks = [
  { label: 'Privacy', path: '/privacy' },
  { label: 'Terms',   path: '/terms'   },
  { label: 'Contact', path: '/contact' },
]
</script>