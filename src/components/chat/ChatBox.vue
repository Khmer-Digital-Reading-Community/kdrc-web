<template>
<div class="min-h-screen bg-[#FDF6E9] flex items-center justify-center p-8 font-sans antialiased text-slate-800">
  <!-- Main Container -->
  <div class="bg-white w-full max-w-5xl h-200 rounded-[3rem] shadow-2xl flex overflow-hidden">
    
    <!-- Sidebar -->
    <div class="w-80 border-r border-slate-100 flex flex-col p-8">
      <h1 class="text-3xl font-serif text-[#0E3B3E]! mb-6">Messages</h1>
      
      <!-- Search -->
      <div class="relative mb-8">
        <input type="text" placeholder="Search chats..." class="w-full bg-slate-50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-emerald-200 outline-none transition-all">
      </div>

<!-- Chat List -->
<div class="space-y-4">
  <!-- Active Chat -->
  <div class="bg-white rounded-4xl p-4 shadow-sm border border-slate-50 flex items-center gap-3">
    <!-- Image Container with flex-shrink-0 to prevent squishing -->
    <div class="relative shrink-0">
      <img 
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" 
        class="w-12 h-12 rounded-2xl object-cover aspect-square" 
        alt="Socheata Ra"
      />
      <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
    </div>
    
    <div class="flex-1 min-w-0"> <!-- min-w-0 helps the truncate class work correctly -->
      <div class="flex justify-between items-start">
        <h3 class="font-bold text-sm truncate">Socheata Ra</h3>
        <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">10:30 AM</span>
      </div>
      <p class="text-xs text-slate-500 truncate">I can meet at ITC school tomorrow.</p>
    </div>
  </div>

        <!-- Inactive Chat (avatar wrapper adjusted to match active profile sizing) -->
        <div class="p-4 flex items-center gap-3 opacity-60">
          <div class="relative">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" class="w-12 h-12 rounded-2xl object-cover" />
            <!-- placeholder dot keeps the same space/overlay as the active item -->
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-transparent border-4 border-white rounded-full"></div>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-sm">Dara Samnang</h3>
              <span class="text-[10px] text-slate-400 font-medium uppercase">Yesterday</span>
            </div>
            <p class="text-xs text-slate-500">Is the condition still good?</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col bg-white">
      <!-- Header -->
      <div class="p-6 flex items-center justify-between border-b border-slate-50">
        <div class="flex items-center gap-4">
          <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=100&q=80" class="w-12 h-12 rounded-xl object-cover" />
          <div>
            <h2 class="font-bold text-sm text-[#093A3F]!">Exchange: Classic Khmer Poems</h2>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400">Chatting with Socheata Ra</span>
            </div>
          </div>
        </div>  
        <div class="flex items-center gap-4">
          <button class="bg-[#FDF6E9] text-[#093A3F] px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-orange-100 transition-colors">View Post</button>
          <button class="text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-8 bg-[#2D5A43] relative" style="background-image: url('https://www.transparenttextures.com/patterns/cubes.png');">
        <!-- Message Left -->
        <div class="flex gap-3 mb-8">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" class="w-8 h-8 rounded-lg object-cover self-end" />
          <div class="bg-white p-5 rounded-4xl rounded-bl-none max-w-md shadow-sm">
            <p class="text-sm leading-relaxed">Hi Dara! I'm interested in swapping my 'Classic Khmer Poems' for your novel.</p>
            <span class="text-[9px] text-slate-400 block mt-2 font-medium">10:20 AM •</span>
          </div>
        </div>

        <!-- Message Right -->
        <div class="flex justify-end mb-8">
          <div class="bg-[#0E3B3E] text-white p-5 rounded-4xl rounded-br-none max-w-md shadow-lg border border-emerald-900/50">
            <p class="text-sm leading-relaxed">That sounds great! I've been looking for that one for weeks.</p>
            <span class="text-[9px] text-emerald-300/60 block mt-2 font-medium">10:22 AM • READ</span>
          </div>
        </div>

        <!-- Message Left 2 -->
        <div class="flex gap-3 mb-8">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" class="w-8 h-8 rounded-lg object-cover self-end" />
          <div class="bg-white p-5 rounded-4xl rounded-bl-none max-w-md shadow-sm">
            <p class="text-sm leading-relaxed">Where is the best place for us to meet in Phnom Penh?</p>
            <span class="text-[9px] text-slate-400 block mt-2 font-medium">10:25 AM •</span>
          </div>
        </div>

         <!-- Message Right 2 -->
         <div class="flex justify-end">
          <div class="bg-[#0E3B3E] text-white p-5 rounded-4xl rounded-br-none max-w-md shadow-lg border border-emerald-900/50">
            <p class="text-sm leading-relaxed">I can meet at ITC school tomorrow around lunch time. Does that work?</p>
            <span class="text-[9px] text-emerald-300/60 block mt-2 font-medium">10:30 AM •</span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-6">
        <div class="bg-slate-50 rounded-full p-2 flex items-center gap-4">
          <button class="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <input type="text" placeholder="Type your message to arrange the exchange..." class="flex-1 bg-transparent border-none text-sm focus:ring-0 outline-none text-slate-600">
          <button class="bg-[#F8A45C] text-white p-3 rounded-full shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>