<template>
  <section class="bg-[#1c3a2e] px-4 md:px-8 lg:px-14 py-10 md:py-12 lg:py-16 flex items-center flex-col md:flex-row gap-8 md:gap-14">

    <!-- Left copy -->
    <div class="flex-1">
      <div class="inline-flex items-center gap-2 bg-[#c5a050]/15 border border-[#c5a050]/35
                  rounded-full px-4 py-1.5 mb-6">
        <svg class="w-3.5 h-3.5 text-[#c5a050]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span class="text-[11px] font-bold tracking-[0.1em] text-[#c5a050] uppercase">
          Cambodia's literary platform
        </span>
      </div>

        <div class="heading-1 text-white mb-4 md:mb-5">
         Read, Write, Share —<br>
         <span class="text-[#c5a050] italic">One Community.</span>
       </div>

      <p class="text-[14px] text-white/60 leading-[1.8] max-w-[430px] mb-6 md:mb-8">
        KDRC is a mobile-first, bilingual (Khmer & English) platform combining
        digital reading, community writing, and physical book exchange — all built
        for Cambodia's next generation of readers and authors.
      </p>

      <div class="flex gap-3">
        <button
          class="flex items-center gap-2 bg-[#c5a050] text-white text-[13px] font-semibold
                 px-6 py-3 rounded-xl hover:bg-[#b8903f] transition-colors duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          Start Reading
        </button>
        <button
          class="flex items-center gap-2 text-white/70 text-[13px] font-medium
                 px-6 py-3 rounded-xl border border-white/20
                 hover:bg-white/5 transition-colors duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Start Writing
        </button>
      </div>
    </div>

    <!-- Right stats grid -->
    <div class="flex-none w-full md:w-[300px] grid grid-cols-2 gap-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white/7 border border-white/10 rounded-xl p-5 text-center"
      >
        <div class="font-['Playfair_Display'] text-[30px] font-black text-[#c5a050]">
          {{ stat.value }}
        </div>
        <div class="text-[11px] text-white/45 mt-1.5 tracking-[0.07em]">
          {{ stat.label }}
        </div>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  name: 'AboutHero',
  data() {
    return {
      stats: [
        { value: '12K+', label: 'Books archived' },
        { value: '5K+',  label: 'Authors' },
        { value: '2',    label: 'Languages' },
        { value: 'Free', label: 'To get started' },
      ],
    }
  },
}
</script>