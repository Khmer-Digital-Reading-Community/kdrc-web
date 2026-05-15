<template>
  <section class="relative overflow-hidden bg-[#faf8f3] py-20 px-6 sm:px-14">

    <!-- Soft background grain texture -->
    <div class="absolute inset-0 opacity-[0.025] pointer-events-none bg-noise"></div>

    <!-- Floating blobs -->
    <div class="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full
                bg-[#F9AE5B]/10 blur-[80px] animate-blob pointer-events-none"></div>
    <div class="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full
                bg-[#093A3F]/8 blur-[60px] animate-blob animation-delay-2000 pointer-events-none"></div>

    <div class="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      <!-- LEFT: copy -->
      <div class="order-2 lg:order-1">

        <div class="inline-flex items-center gap-2 bg-[#093A3F]/[0.06] border border-[#093A3F]/[0.1]
                    rounded-full px-4 py-1.5 mb-6 animate-fade-up animation-delay-100">
          <span class="w-1.5 h-1.5 rounded-full bg-[#F9AE5B] animate-pulse-slow"></span>
          <span class="text-[11px] font-bold tracking-[0.14em] text-[#093A3F]/70 uppercase">
            Our Story
          </span>
        </div>

        <div class="font-['DM_Sans',sans-serif] text-[36px] sm:text-[44px] font-black
                    text-[#093A3F] leading-[1.12] mb-6 animate-fade-up animation-delay-200">
          Where every<br/>
          story finds<br/>
          <span class="italic text-[#F9AE5B]">its reader.</span>
        </div>

        <p class="text-[15px] text-[#5a5a5a] leading-[1.8] max-w-[420px] mb-8
                  animate-fade-up animation-delay-300">
          KDRC was born from a simple belief — that Cambodian stories deserve a permanent,
          beautiful, accessible home. We build the space where writers and readers
          find each other across generations.
        </p>

        <!-- Stats row -->
        <div class="flex gap-8 mb-10 animate-fade-up animation-delay-400">
          <div v-for="s in stats" :key="s.label">
            <p class="font-['Playfair_Display',serif] text-[28px] font-bold text-[#093A3F] leading-none">
              {{ s.val }}
            </p>
            <p class="text-[11px] font-semibold text-[#aaa] mt-1 tracking-[0.08em] uppercase">
              {{ s.label }}
            </p>
          </div>
        </div>

        <div class="flex gap-3 animate-fade-up animation-delay-500">
          <button class="flex items-center gap-2 bg-[#093A3F] text-white text-[13px] font-semibold
                         px-6 py-3 rounded-xl hover:bg-[#F9AE5B] transition-colors duration-300">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
            </svg>
            Explore the Library
          </button>
          <button class="flex items-center gap-2 text-[#093A3F] text-[13px] font-semibold
                         px-6 py-3 rounded-xl border border-[#093A3F]/20
                         hover:bg-[#093A3F]/5 transition-colors duration-200">
            Meet the Team
          </button>
        </div>

      </div>

      <!-- RIGHT: animated scene -->
      <div class="order-1 lg:order-2 relative flex justify-center items-center min-h-[480px]">

        <!-- Main reader card -->
        <div class="relative w-[320px] sm:w-[360px] animate-float">

          <!-- Photo card -->
          <div class="relative rounded-3xl overflow-hidden shadow-[0_24px_64px_rgba(9,58,63,0.18)]">
            <img
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=720&q=85"
              alt="Person reading"
              class="w-full h-[400px] object-cover object-center"
            />
            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#093A3F]/70 via-transparent to-transparent"></div>

            <!-- Caption at bottom of photo -->
            <div class="absolute bottom-0 left-0 right-0 p-5">
              <p class="font-['Playfair_Display',serif] text-white text-[18px] font-bold italic leading-snug">
                "A book is a dream<br/>you hold in your hands."
              </p>
              <p class="text-white/50 text-[11px] mt-1.5 font-medium tracking-wide">Neil Gaiman</p>
            </div>
          </div>

          <!-- Floating badge: chapter progress -->
          <div class="absolute -right-12 top-8 bg-white rounded-2xl px-4 py-3 shadow-xl
                      border border-[#e8e4dc] animate-float-delayed w-[148px]">
            <p class="text-[10px] font-bold text-[#F9AE5B] uppercase tracking-[0.1em] mb-1">Reading now</p>
            <p class="text-[13px] font-semibold text-[#093A3F] leading-snug">The Silent Atelier</p>
            <div class="mt-2 h-1.5 bg-[#f0ece4] rounded-full overflow-hidden">
              <div class="h-full bg-[#F9AE5B] rounded-full w-[46%] animate-progress"></div>
            </div>
            <p class="text-[10px] text-[#bbb] mt-1">Chapter 14 · 46%</p>
          </div>

          <!-- Floating badge: community -->
          <div class="absolute -left-10 bottom-16 bg-[#093A3F] rounded-2xl px-4 py-3 shadow-xl
                      animate-float w-[140px]" style="animation-delay: 0.8s;">
            <p class="text-[10px] font-bold text-[#F9AE5B]/70 uppercase tracking-[0.1em] mb-1.5">Community</p>
            <!-- Avatar stack -->
            <div class="flex -space-x-2 mb-1.5">
              <div v-for="(a, i) in avatars" :key="i"
                   class="w-7 h-7 rounded-full border-2 border-[#093A3F] flex items-center justify-center text-[10px] font-semibold text-white flex-none"
                   :style="{ background: a.color }">
                {{ a.initial }}
              </div>
            </div>
            <p class="text-white text-[12px] font-semibold leading-none">5,000+ readers</p>
            <p class="text-white/40 text-[10px] mt-0.5">joined this week</p>
          </div>

          <!-- Floating badge: genre tag -->
          <div class="absolute -right-8 bottom-10 bg-[#F9AE5B] rounded-xl px-3 py-2 shadow-lg
                      animate-float-delayed" style="animation-delay: 1.4s;">
            <p class="text-white text-[11px] font-bold">📚 Khmer Lit</p>
          </div>

        </div>

        <!-- Orbiting decorative books -->
        <div class="absolute top-6 left-2 animate-float" style="animation-delay: 0.3s;">
          <div class="w-10 h-14 bg-[#093A3F] rounded-md shadow-lg opacity-70
                      flex items-center justify-center rotate-[-8deg]">
            <span class="text-[#F9AE5B] text-[8px] font-bold [writing-mode:vertical-rl] rotate-180">KDRC</span>
          </div>
        </div>
        <div class="absolute bottom-10 right-2 animate-float-delayed" style="animation-delay: 1s;">
          <div class="w-8 h-12 bg-[#F9AE5B] rounded-md shadow-lg opacity-60
                      flex items-center justify-center rotate-[6deg]">
          </div>
        </div>
        <div class="absolute top-1/2 left-0 -translate-y-1/2 animate-float" style="animation-delay: 0.6s;">
          <div class="w-6 h-10 bg-[#5a3e2b] rounded-sm shadow-md opacity-40 rotate-[-4deg]"></div>
        </div>

      </div>
    </div>

    <!-- Scrolling marquee strip -->
    <div class="mt-16 overflow-hidden border-t border-b border-[#e8e4dc] py-3.5">
      <div class="flex animate-marquee whitespace-nowrap gap-0">
        <span v-for="(item, i) in [...marquee, ...marquee]" :key="i"
              class="inline-flex items-center gap-3 mr-8 text-[12px] font-semibold text-[#093A3F]/40 uppercase tracking-[0.12em]">
          <span class="w-1 h-1 rounded-full bg-[#F9AE5B] inline-block flex-none"></span>
          {{ item }}
        </span>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  name: 'AboutReaderHero',
  data() {
    return {
      stats: [
        { val: '12K+', label: 'Books archived' },
        { val: '5K+',  label: 'Authors'        },
        { val: '2019', label: 'Est. Phnom Penh' },
      ],
      avatars: [
        { initial: 'D', color: '#093A3F' },
        { initial: 'L', color: '#7a3d92' },
        { initial: 'V', color: '#3a5fa5' },
        { initial: 'S', color: '#F9AE5B' },
      ],
      marquee: [
        'Khmer Literature', 'Community Reading', 'Free Stories',
        'Book Exchange', 'Author Tools', 'Copyright Protected',
        'Bilingual Platform', 'Mobile First', 'Open Access',
      ],
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:wght@400;500;600&display=swap');

/* ── KEYFRAMES ──────────────────────────────────── */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
}
@keyframes floatDelayed {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
@keyframes blob {
  0%, 100% { transform: scale(1) translate(0, 0); }
  33%       { transform: scale(1.08) translate(20px, -15px); }
  66%       { transform: scale(0.94) translate(-10px, 10px); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes progress {
  from { width: 0%; }
  to   { width: 46%; }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes pulseSlow {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* ── ANIMATION CLASSES ─────────────────────────── */
.animate-float         { animation: float 5s ease-in-out infinite; }
.animate-float-delayed { animation: floatDelayed 6s ease-in-out infinite; }
.animate-blob          { animation: blob 10s ease-in-out infinite; }
.animation-delay-2000  { animation-delay: 2s; }

.animate-fade-up           { animation: fadeUp 0.6s ease-out both; }
.animation-delay-100       { animation-delay: 0.10s; }
.animation-delay-200       { animation-delay: 0.20s; }
.animation-delay-300       { animation-delay: 0.30s; }
.animation-delay-400       { animation-delay: 0.40s; }
.animation-delay-500       { animation-delay: 0.50s; }

.animate-progress          { animation: progress 1.4s cubic-bezier(.4,0,.2,1) 0.8s both; }
.animate-marquee           { animation: marquee 26s linear infinite; }
.animate-pulse-slow        { animation: pulseSlow 2.4s ease-in-out infinite; }

/* Grain background texture */
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px;
}
</style>