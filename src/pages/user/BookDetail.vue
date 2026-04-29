<template>
  <div class="bg-[#f9fafb] text-gray-800 font-sans antialiased min-h-screen flex flex-col">
    <main class="max-w-5xl mx-auto px-6 py-10 md:py-16 w-full flex-1">
      <nav class="text-xs text-gray-500 mb-8 font-medium">
        <a href="#" class="hover:text-gray-900 transition">Explore</a>
        <span class="mx-1">&gt;</span>
        <span class="text-gray-400">Book Details</span>
      </nav>

      <div class="flex flex-col md:flex-row gap-10 lg:gap-16 mb-20">
        <div class="w-full md:w-[320px] shrink-0">
            <img 
                :src="bookCoverSrc" 
                @error="onCoverError" 
                alt="Book cover" 
                class="w-full aspect-2/3 rounded shadow-xl object-cover" 
                />
        </div>

        <div class="flex-1 flex flex-col justify-center">
          <div class="flex flex-wrap items-center gap-4 mb-4">
            <span class="bg-gray-200/80 text-gray-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">Editorial Choice</span>
            <div class="flex items-center gap-1">
              <div class="flex text-yellow-500 text-sm">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
              <span class="text-xs text-gray-900 font-medium ml-1">4.8 <span class="text-gray-500 font-normal">(1.2k Reviews)</span></span>
            </div>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">The Whispering Vellum</h1>
          <p class="text-gray-500 mb-8">by <a href="#" class="text-[#134e4a] font-bold hover:underline">Elias Thorne</a></p>

          <div class="text-gray-600 text-sm md:text-base leading-relaxed space-y-4 mb-8">
            <p>Deep within the archives of a forgotten library, Julian discovers a manuscript that writes itself as he reads. A haunting exploration of destiny, creative obsession, and the thin line between the author and the art.</p>
            <p>In this evocative debut, Elias Thorne weaves a narrative that mirrors the tactile experience of turning heavy, age-worn pages. "The Whispering Vellum" isn't just a story; it's an invitation to lose oneself in the architecture of language.</p>
          </div>

          <div class="flex items-center gap-3 mb-10 md:mb-14">
            <button class="bg-[#0f3b35] hover:bg-[#0a2622] transition-colors text-white px-6 py-3 rounded-md font-semibold text-sm flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              Read Now
            </button>
            <button class="bg-white border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 p-3 rounded-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-6 border-t border-gray-200 pt-6">
            <div>
              <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Length</div>
              <div class="text-sm font-semibold text-gray-900">242 Pages</div>
            </div>
            <div>
              <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Language</div>
              <div class="text-sm font-semibold text-gray-900">English</div>
            </div>
            <div>
              <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Publisher</div>
              <div class="text-sm font-semibold text-gray-900">Atelier Press</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-1">Table of Contents</h2>
          <p class="text-sm text-gray-500">The architectural bones of the story.</p>
        </div>

        <div class="space-y-3">
          <div class="group flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer">
            <div class="flex items-center gap-6">
              <span class="text-gray-300 font-mono text-lg w-6">01</span>
              <div>
                <h3 class="font-semibold text-gray-900 group-hover:text-[#134e4a] transition-colors">The Scent of Ancient Dust</h3>
                <p class="text-xs text-gray-500 mt-0.5">12 minutes read • Free Preview</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="bg-[#e6f4ea] text-[#1e8e3e] text-[10px] font-bold px-2 py-1 rounded tracking-wide">PUBLIC</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>

          <div class="group flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer">
            <div class="flex items-center gap-6">
              <span class="text-gray-300 font-mono text-lg w-6">02</span>
              <div>
                <h3 class="font-semibold text-gray-900 group-hover:text-[#134e4a] transition-colors">The Ink That Never Dries</h3>
                <p class="text-xs text-gray-500 mt-0.5">16 minutes read • Free Preview</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="bg-[#e6f4ea] text-[#1e8e3e] text-[10px] font-bold px-2 py-1 rounded tracking-wide">PUBLIC</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-100/50 rounded-lg border border-transparent">
            <div class="flex items-center gap-6">
              <span class="text-gray-300 font-mono text-lg w-6">03</span>
              <div>
                <h3 class="font-semibold text-gray-400">Midnight in the West Wing</h3>
                <p class="text-xs text-gray-400 mt-0.5">18 minutes read</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1.5 bg-gray-200/80 text-gray-500 text-[10px] font-bold px-2 py-1 rounded tracking-wide">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                PREMIUM
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-100/50 rounded-lg border border-transparent">
            <div class="flex items-center gap-6">
              <span class="text-gray-300 font-mono text-lg w-6">04</span>
              <div>
                <h3 class="font-semibold text-gray-400">The Architect's Silence</h3>
                <p class="text-xs text-gray-400 mt-0.5">22 minutes read</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1.5 bg-gray-200/80 text-gray-500 text-[10px] font-bold px-2 py-1 rounded tracking-wide">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                PREMIUM
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-100/50 rounded-lg border border-transparent">
            <div class="flex items-center gap-6">
              <span class="text-gray-300 font-mono text-lg w-6">05</span>
              <div>
                <h3 class="font-semibold text-gray-400">Paper Cut Epiphanies</h3>
                <p class="text-xs text-gray-400 mt-0.5">14 minutes read</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1.5 bg-gray-200/80 text-gray-500 text-[10px] font-bold px-2 py-1 rounded tracking-wide">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                PREMIUM
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center">
          <button class="bg-gray-200/80 hover:bg-gray-300 transition-colors text-gray-800 text-xs font-bold px-6 py-2.5 rounded-full">View All 24 Chapters</button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '../../components/common/Footer.vue'
import bookCoverSrc from '../../assets/images/BookCover.png'

function onCoverError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'https://placehold.co/320x480?text=Book+Cover'
}
</script>
