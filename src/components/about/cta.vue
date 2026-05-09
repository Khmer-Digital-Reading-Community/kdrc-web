<template>
  <section class="bg-[#1c3a2e] px-4 md:px-8 lg:px-14 py-10 md:py-12 lg:py-14 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative overflow-hidden">

    <!-- Decorative circles -->
    <div class="absolute -top-16 right-24 w-56 h-56 rounded-full bg-[#c5a050]/8 pointer-events-none"></div>
    <div class="absolute -bottom-10 right-0 w-40 h-40 rounded-full bg-white/3 pointer-events-none"></div>

    <!-- Copy -->
    <div class="relative z-10">
       <div class="heading-2 text-white mb-2 md:mb-3">
         Join Cambodia's reading community.
       </div>
      <p class="text-[14px] text-white/55 leading-[1.75] max-w-[460px] mb-4 md:mb-0">
        Read classic Khmer literature, publish your stories, swap books with neighbors —
        all in one place, in your language.
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 flex-shrink-0 relative z-10">
      <button
        class="flex items-center gap-2 bg-[#c5a050] text-white text-[13px] font-semibold
               px-6 py-3 rounded-xl whitespace-nowrap
               hover:bg-[#b8903f] transition-colors duration-200"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13"/>
        </svg>
        Start for free
      </button>
      <button
        class="flex items-center gap-2 text-white/65 text-[13px] font-medium
               px-6 py-3 rounded-xl whitespace-nowrap border border-white/20
               hover:bg-white/5 transition-colors duration-200"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        Become an author
      </button>
    </div>

  </section>
</template>

<script>
export default {
  name: 'AboutCTA',
}
</script>