<template>
  <div class="bg-[#fbfbfc] min-h-screen pt-6 pb-36 md:pb-20 px-4 sm:px-6 lg:px-10 font-sans selection:bg-[#093A3F]/10">
    <div class="max-w-[1280px] mx-auto">
      
      <nav class="text-[13px] text-gray-400 mb-8 flex gap-2 font-medium">
        <span>Marketplace</span> <span class="text-gray-300">›</span> 
        <span>Exchanges</span> <span class="text-gray-300">›</span> 
        <span class="text-gray-900 font-bold">The Art of Stillness</span>
      </nav>

      <div class="flex flex-col md:grid md:grid-cols-12 gap-8 lg:gap-12">
        
        <div class="w-full max-w-[280px] mx-auto md:mx-0 md:max-w-none md:col-span-4 lg:col-span-3">
          <div class="md:sticky md:top-8">
            <div class="aspect-[3/4.2] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 p-3">
              <img :src="bookCover" alt="Book Cover" class="w-full h-full object-cover rounded-[24px]" />
            </div>
          </div>
        </div>

        <div class="w-full md:col-span-8 lg:col-span-9 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div class="lg:col-span-8 space-y-10">
            <section>
              <div class="flex items-center gap-4 mb-5">
                <span class="bg-[#e7f6ef] text-[#52B788] text-[11px] font-bold px-3.5 py-1.5 rounded-lg uppercase tracking-wider">Like New</span>
                <span class="text-[13px] text-gray-400 flex items-center gap-1.5 font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Phnom Penh, Cambodia
                </span>
              </div>
              
              <h1 class="text-[32px] sm:text-[44px] lg:text-[52px] font-serif font-bold text-[#093A3F] leading-[1.1] mb-3">The Art of Stillness</h1>
              <p class="text-[18px] text-[#c1712a] font-bold mb-8">by Pico Iyer</p>

              <div class="flex flex-wrap gap-2.5 mb-10">
                <span v-for="tag in ['Non-Fiction', 'English', 'Posted 2 Days Ago']" :key="tag"
                  class="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider">
                  {{ tag }}
                </span>
              </div>

              <div class="relative pl-8">
                <div class="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#c1712a] rounded-full"></div>
                <p class="italic text-gray-500 text-[16px] sm:text-[17px] leading-relaxed font-medium">
                  "In an age of speed, I began to think, nothing could be more invigorating than going slow. In an age of distraction, nothing is so luxurious as paying attention."
                </p>
              </div>
            </section>

            <div class="block md:hidden">
              <div class="bg-[#f8f9fa] rounded-[40px] p-8 border border-gray-100 text-center shadow-sm">
                <div class="relative w-28 h-28 mx-auto mb-5">
                  <div class="w-full h-full rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                    <img v-if="userAvatar" :src="userAvatar" class="w-full h-full object-cover" alt="Profile Picture" />
                    <span v-else class="text-gray-400 font-bold">SK</span>
                  </div>
                  <div class="absolute bottom-1 right-2 w-6 h-6 bg-[#52B788] border-4 border-white rounded-full"></div>
                </div>
                <h3 class="text-[20px] font-bold text-[#093A3F] mb-1">Sophea Khem</h3>
                <span class="text-[11px] font-bold text-[#7B61FF] bg-[#f3f0ff] px-4 py-1.5 rounded-full uppercase tracking-wider">Active Exchanger</span>
                
                <div class="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200">
                  <div>
                    <p class="text-[18px] font-bold text-gray-900">4.9 ★</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rating</p>
                  </div>
                  <div>
                    <p class="text-[18px] font-bold text-gray-900">100%</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Response</p>
                  </div>
                </div>
                <p class="text-[13px] text-gray-500 mt-8 italic leading-relaxed font-medium">
                  "Passionate reader from Phnom Penh. Usually finishing two books a week and looking for new perspectives."
                </p>
              </div>
            </div>

            <div class="bg-white rounded-[40px] border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-sm">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-[#FDEEE0] rounded-2xl flex items-center justify-center text-[#c1712a]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
                </div>
                <h2 class="text-[22px] font-bold text-[#093A3F]">Exchange Terms</h2>
              </div>
              <p class="text-gray-500 text-[15px] leading-relaxed mb-8 font-medium">
                I am looking to trade this beautiful copy for books in the following genres. I'm specifically looking for editions in similar condition.
              </p>
              <div class="flex flex-wrap gap-3">
                <span v-for="tag in ['Travel Memoir', 'Philosophy', 'Zen Studies']" :key="tag" 
                  class="bg-[#f3f0ff] text-[#7B61FF] px-5 py-2.5 rounded-xl text-[13px] sm:text-[14px] font-bold">
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-10 sm:gap-6 lg:gap-12 pt-4">
              <div class="flex-1">
                <h3 class="font-bold text-[#093A3F] mb-6 flex items-center gap-3 text-[17px]">
                  <span class="w-[3px] h-6 bg-[#c1712a] rounded-full"></span> Specifications
                </h3>
                <ul class="space-y-5">
                  <li v-for="(val, label) in { Format: 'Hardcover', Pages: '128', Language: 'English', ISBN: '978-1476784779' }" 
                      :key="label" class="flex justify-between border-b border-gray-50 pb-3 text-[14px]">
                    <span class="text-gray-400 font-medium">{{ label }}</span>
                    <span class="font-bold text-[#093A3F]">{{ val }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="flex-1">
                <h3 class="font-bold text-[#093A3F] mb-6 flex items-center gap-3 text-[17px]">
                  <span class="w-[3px] h-6 bg-[#c1712a] rounded-full"></span> Quality Check
                </h3>
                <ul class="space-y-4">
                  <li v-for="check in ['No highlights or annotations', 'Binding tight and intact', 'Minimal shelf wear on corners', 'Includes original dust jacket']" 
                    :key="check" class="flex items-start gap-3 text-[14px] font-bold text-gray-600">
                    <div class="w-5 h-5 rounded-full bg-[#e7f6ef] flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52B788" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    {{ check }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="block md:hidden">
              <div class="bg-[#f8f9fa] rounded-[40px] p-8 border border-gray-100 shadow-sm">
                <div class="flex justify-between items-center mb-5">
                  <h4 class="font-bold text-[#093A3F] text-[15px]">Location</h4>
                  <button class="text-[#7B61FF] text-[13px] font-bold hover:underline">View on map</button>
                </div>
                <div class="bg-[#ebedf0] h-40 rounded-3xl mb-4 overflow-hidden relative border border-gray-100">
                   <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400" class="w-full h-full object-cover opacity-50 grayscale" />
                   <div class="absolute inset-0 flex items-center justify-center">
                      <div class="w-10 h-10 bg-[#7B61FF] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                   </div>
                </div>
                <p class="text-[13px] text-gray-400 font-bold text-center">BKK1, Phnom Penh, Cambodia</p>
              </div>
            </div>
          </div>

          <div class="hidden md:block lg:col-span-4 space-y-8">
            <div class="bg-[#f8f9fa] rounded-[40px] p-8 border border-gray-100 text-center shadow-sm">
              <div class="relative w-28 h-28 mx-auto mb-5">
                <div class="w-full h-full rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                  <img v-if="userAvatar" :src="userAvatar" class="w-full h-full object-cover" alt="Profile Picture" />
                  <span v-else class="text-gray-400 font-bold">SK</span>
                </div>
                <div class="absolute bottom-1 right-2 w-6 h-6 bg-[#52B788] border-4 border-white rounded-full"></div>
              </div>
              <h3 class="text-[20px] font-bold text-[#093A3F] mb-1">Sophea Khem</h3>
              <span class="text-[11px] font-bold text-[#7B61FF] bg-[#f3f0ff] px-4 py-1.5 rounded-full uppercase tracking-wider">Active Exchanger</span>
              
              <div class="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div>
                  <p class="text-[18px] font-bold text-gray-900">4.9 ★</p>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rating</p>
                </div>
                <div>
                  <p class="text-[18px] font-bold text-gray-900">100%</p>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Response</p>
                </div>
              </div>
              <p class="text-[13px] text-gray-500 mt-8 italic leading-relaxed font-medium">
                "Passionate reader from Phnom Penh. Usually finishing two books a week and looking for new perspectives."
              </p>
            </div>

            <div class="bg-[#f8f9fa] rounded-[40px] p-8 border border-gray-100 shadow-sm">
              <div class="flex justify-between items-center mb-5">
                <h4 class="font-bold text-[#093A3F] text-[15px]">Location</h4>
                <button class="text-[#7B61FF] text-[13px] font-bold hover:underline">View on map</button>
              </div>
              <div class="bg-[#ebedf0] h-40 rounded-3xl mb-4 overflow-hidden relative border border-gray-100">
                 <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400" class="w-full h-full object-cover opacity-50 grayscale" />
                 <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-10 h-10 bg-[#7B61FF] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                 </div>
              </div>
              <p class="text-[13px] text-gray-400 font-bold text-center">BKK1, Phnom Penh, Cambodia</p>
            </div>
          </div>

        </div>
      </div>

      <div class="fixed bottom-0 left-0 right-0 w-full p-4 bg-white/90 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-gray-100 z-50 md:relative md:bg-transparent md:backdrop-blur-none md:border-t-0 md:p-0 md:shadow-none mt-16 md:mt-20">
        <div class="bg-white border border-gray-100 rounded-2xl md:rounded-[32px] p-4 md:p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6 md:shadow-lg max-w-[1280px] mx-auto">
          <div class="hidden sm:block text-left">
            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">Exchange Status</p>
            <p class="text-[20px] md:text-[22px] font-bold text-[#093A3F]">Available for trade</p>
          </div>
          <div class="flex flex-row gap-3 md:gap-5 w-full sm:w-auto">
            <button class="bg-[#f3f0ff] text-[#7B61FF] px-6 py-3.5 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-bold text-[14px] md:text-[15px] hover:bg-[#e9e4ff] transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-initial">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Message
            </button>
            <button class="bg-[#093A3F] text-white px-8 py-3.5 md:px-12 md:py-4 rounded-xl md:rounded-2xl font-bold text-[14px] md:text-[15px] flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-[#093a3f20] hover:opacity-90 transition-opacity flex-1 sm:flex-initial whitespace-nowrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              Propose Exchange
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import bookCover from '../../assets/images/books/Book1.png'
import userAvatar from '../../assets/images/books/users/user2.jpg'
</script>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>