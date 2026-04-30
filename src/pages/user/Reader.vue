<template>
  <div class="reader-shell bg-gray-100 h-screen w-full flex items-center justify-center p-4 md:p-8">
    <div class="bg-white w-full max-w-6xl h-full rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 ring-4 ring-blue-500/10">
      <header class="bg-[#fcfcfc] border-b border-gray-100 flex items-center justify-between px-4 py-3 shrink-0">
        <div class="flex items-center gap-4">
          <button class="w-8 h-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h1 class="text-sm font-bold text-gray-700">Moon over Tonle Sap</h1>
        </div>
        <button class="w-8 h-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
        </button>
      </header>

      <main class="flex-1 overflow-y-auto relative">
        <div class="max-w-3xl mx-auto px-8 py-12 md:py-16 relative">
          <div class="text-center mb-16 relative">
            <span class="text-[10px] font-bold text-[#f59e0b] tracking-[0.2em] uppercase">Chapter 2</span>
            <h2 class="text-2xl text-gray-700 mt-2 font-medium">The river remembers</h2>

            <button class="absolute top-0 right-0 md:-right-16 lg:-right-24 w-8 h-8 bg-white border border-gray-200 rounded shadow-sm hidden sm:inline-flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
          </div>

          <article class="text-[#6b7280] text-base md:text-[17px] leading-[1.8] space-y-8 font-serif">
            <p>
              When dawn lifts off the surface of the Tonle Sap, the river exhales a slow mist that carries stories of families and fishermen. The sampans glide like low-slung memories, paddles whispering in time with the swing of the current. Old house posts stand as quiet witnesses to seasons of flood and retreat, their bases darkened with the river's changing moods.
            </p>
            <p>
              Mae Srey moves along the bank with a basket of woven mats balanced on her hip, the same route her grandmother once took. Children chase silver flashes beneath the surface where the water opens into pools of sun. A temple bell rings faintly across the channel, weaving a note that hums through the ribs of the village, pulling the morning into slow focus.
            </p>
            <p>
              The river remembers names, mouths and harvests; it keeps ledger of every boat that has cut its skin. When traders arrive with bundles and spices, the water takes their footprints and smoothes them into the current's skin. Even the stones at the shallows seem to recall the patience of those who have mended nets and offered rice to the waiting water.
            </p>
            <p>
              At midday the light flattens, revealing patterns carved into the wooden hulls and the weathered hands that tend them. Stories are unspooled in the shade of banana trees - tales of long journeys upriver, of rains that came late, of lovers separated by distance and reunited on a single high tide. The river keeps them all, patient and unhurried, and in its reflection the village learns to see itself anew.
            </p>
          </article>
        </div>
      </main>

      <footer class="bg-[#fcfcfc] border-t border-gray-100 flex items-center justify-between px-6 py-4 shrink-0">
        <button class="px-5 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
          Previous
        </button>
        <span class="text-xs text-gray-400 font-medium tracking-wide">
          Page 1 of 8
        </span>
        <button class="px-5 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
          Next
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.reader-shell ::-webkit-scrollbar {
  width: 6px;
}

.reader-shell ::-webkit-scrollbar-track {
  background: transparent;
}

.reader-shell ::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.reader-shell ::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
