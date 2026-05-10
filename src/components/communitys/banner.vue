<template>
  <div class="bg-[#1c3a2e] rounded-2xl px-4 sm:px-7 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 overflow-hidden relative">

    <!-- Decorative circle -->
    <div class="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-[#c5a050]/[0.07] pointer-events-none"></div>

    <!-- Left copy -->
    <div class="relative z-10">
      <p class="text-[10px] font-bold tracking-[0.16em] text-[#c5a050]/70 uppercase mb-1">
        Literary Community
      </p>
      <h1 class="font-['Syne',sans-serif] text-[20px] sm:text-[22px] font-extrabold text-white tracking-tight mb-1">
        The Atelier Feed
      </h1>
      <p class="text-[12px] text-white/50 leading-relaxed">
        Join 5,000+ readers and writers sharing stories, reviews, and ideas.
      </p>
    </div>

    <!-- Stats -->
    <div class="flex gap-4 sm:gap-5 flex-shrink-0 relative z-10 self-end sm:self-auto">
      <div v-for="s in stats" :key="s.label" class="text-center">
        <span class="block font-['Syne',sans-serif] text-[20px] font-bold text-[#c5a050] leading-none">
          {{ s.val }}
        </span>
        <span class="text-[10px] text-white/45 mt-1 tracking-[0.06em] block">{{ s.label }}</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CommunityBanner',
  data() {
    return {
      stats: [
        { val: '5k+',  label: 'Members'   },
        { val: '12k+', label: 'Posts'     },
        { val: '38k+', label: 'Reactions' },
      ],
    }
  },
}
</script>