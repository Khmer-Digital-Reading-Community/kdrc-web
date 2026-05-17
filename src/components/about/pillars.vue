<template>
  <section class="bg-white px-14 py-14">

    <!-- Header -->
    <p class="text-[11px] font-bold tracking-[0.14em] text-[#F9AE5B] uppercase mb-2">
      What we offer
    </p>
     <div class="heading-2 text-[#093A3F] mb-10">
       Everything a reader or writer needs
     </div>

    <!-- Pillars grid -->
    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="pillar in pillars"
        :key="pillar.title"
        class="bg-[#faf8f3] border border-[#e8e4dc] rounded-xl p-6
               hover:border-[#F9AE5B] hover:shadow-sm transition-all duration-200 group"
      >
        <!-- Icon -->
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
          :style="{ background: pillar.iconBg }"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
               stroke-width="1.8" :style="{ color: pillar.iconColor }"
               v-html="pillar.iconPath">
          </svg>
        </div>

        <!-- Title -->
        <div class="text-[14px] font-semibold text-[#093A3F] mb-2 group-hover:text-[#F9AE5B] transition-colors">
          {{ pillar.title }}
        </div>

        <!-- Description -->
        <div class="text-[12px] text-gray-500 leading-relaxed">
          {{ pillar.desc }}
        </div>

        <!-- Tag pill -->
        <div class="mt-4">
          <span
            class="inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
            :style="{ background: pillar.tagBg, color: pillar.tagColor }"
          >
            {{ pillar.tag }}
          </span>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  name: 'AboutPillars',
  data() {
    return {
      pillars: [
        {
          title: 'Free library',
          desc: 'Classic Khmer literature, public domain works & educational books — free, curated and categorised by genre.',
          tag: 'Open access',
          iconBg: '#e8f0ee',
          iconColor: '#093A3F',
          tagBg: '#e8f0ee',
          tagColor: '#093A3F',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"/>',
        },
        {
          title: 'Write & publish',
          desc: 'Create books, manage chapters, publish episodically. Readers become writers automatically — no separate signup.',
          tag: 'For creators',
          iconBg: '#fdf6e8',
          iconColor: '#F9AE5B',
          tagBg: '#fdf6e8',
          tagColor: '#e8963f',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>',
        },
        {
          title: 'Community',
          desc: 'Reviews, chapter comments, likes, follows. Discuss books, interact with authors, and build your reading circle.',
          tag: 'Social',
          iconBg: '#eef2fb',
          iconColor: '#3a5fa5',
          tagBg: '#eef2fb',
          tagColor: '#3a5fa5',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>',
        },
        {
          title: 'Book exchange',
          desc: 'Post physical books to swap, lend, or sell. Built-in chat connects buyer and seller locally in Cambodia.',
          tag: 'Local network',
          iconBg: '#f0e8f5',
          iconColor: '#7a3d92',
          tagBg: '#f0e8f5',
          tagColor: '#7a3d92',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>',
        },
      ],
    }
  },
}
</script>