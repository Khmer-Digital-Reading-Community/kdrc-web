<template>
  <div class="min-h-screen bg-[#FDF6E9] flex flex-col font-sans antialiased text-slate-800 overflow-x-hidden">
    <!-- Header -->
    <header class="w-full bg-[#093A3F] px-6 py-4 flex items-center justify-between border-b border-white/10 shadow-md">
      <div class="flex items-center gap-4">
        <button
          @click="router.push('/home')"
          class="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          title="Back to Home"
        >
          <ArrowLeft :size="20" />
        </button>
        <div class="flex items-center gap-2">
          <span class="text-white text-xl font-bold tracking-wide">KDRC Book Exchange</span>
          <span class="hidden sm:inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <Sparkles :size="10" /> Live
          </span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div v-if="isAuthenticated" class="hidden sm:flex items-center gap-2 text-white/90">
          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span class="text-xs font-medium">{{ currentUser?.name || 'Reader' }}</span>
        </div>
        <button
          v-else
          @click="router.push('/login')"
          class="bg-amber-500 text-slate-900 px-4 py-1.5 rounded-xl text-xs font-bold uppercase hover:bg-amber-400 transition-colors"
        >
          Log In
        </button>
      </div>
    </header>

    <!-- Main Grid: Listings | Chat -->
    <div class="flex-1 flex flex-col md:flex-row items-stretch md:items-start max-w-[1600px] w-full mx-auto p-4 sm:p-6 gap-4">

      <!-- Mobile Tab Switcher -->
      <div class="flex md:hidden bg-white border border-slate-100 p-1.5 rounded-2xl w-full shadow-sm mb-2 shrink-0">
        <button
          type="button"
          @click="activeTab = 'listings'"
          :class="activeTab === 'listings' ? 'bg-[#093A3F] text-white font-bold shadow-md shadow-[#093A3F]/10' : 'text-slate-500 hover:text-slate-800 font-semibold'"
          class="flex-1 py-2.5 text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <BookOpen :size="14" />
          Listings ({{ listings.length }})
        </button>
        <button
          type="button"
          @click="activeTab = 'chat'"
          :class="activeTab === 'chat' ? 'bg-[#093A3F] text-white font-bold shadow-md shadow-[#093A3F]/10' : 'text-slate-500 hover:text-slate-800 font-semibold'"
          class="flex-1 py-2.5 text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 relative"
        >
          <MessageSquare :size="14" />
          Chat Room
          <span v-if="onlineMembers.length" class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        </button>
      </div>

      <!-- ═══════════════════════════════════════════════
           LEFT: Listings Panel
      ════════════════════════════════════════════════ -->
      <aside
        :class="[
          activeTab === 'listings' ? 'flex' : 'hidden md:flex',
          'flex-col w-full md:w-[420px] xl:w-[480px] shrink-0 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-4 h-[calc(100vh-160px)] md:h-[calc(100vh-97px)] self-start'
        ]"
      >
        <!-- Panel header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <BookOpen :size="16" />
            </div>
            <div>
              <h2 class="text-sm font-bold text-slate-800">Book Listings</h2>
              <p class="text-[10px] text-slate-400 font-medium">{{ listings.length }} available</p>
            </div>
          </div>
          <button
            v-if="isAuthenticated"
            @click="openPostModal"
            class="flex items-center gap-1.5 bg-[#093A3F] hover:bg-[#0E3B3E] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#093A3F]/10"
          >
            <Plus :size="14" />
            List a Book
          </button>
          <button
            v-else
            @click="router.push('/login')"
            class="text-xs text-amber-700 font-semibold border border-amber-300 px-3 py-1.5 rounded-xl hover:bg-amber-50 transition-colors"
          >
            Sign in to Post
          </button>
        </div>

        <!-- Search bar -->
        <div class="px-4 py-3 border-b border-slate-100">
          <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search :size="14" class="text-slate-400 shrink-0" />
            <input
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="Search by title or author…"
              class="flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <!-- Listings scroll area -->
        <div class="flex-1 overflow-y-auto p-3 space-y-3">
          <!-- Loading -->
          <div v-if="listingsLoading" class="flex flex-col items-center justify-center py-16 gap-3">
            <div class="w-7 h-7 border-2 border-[#093A3F] border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs text-slate-400">Loading listings…</span>
          </div>

          <!-- Empty -->
          <div v-else-if="listings.length === 0" class="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <BookOpen :size="40" class="text-slate-300 mb-3" />
            <p class="text-sm font-bold text-slate-600">No listings yet</p>
            <p class="text-xs mt-1">Be the first to list a book!</p>
          </div>

          <!-- Listing cards -->
          <div
            v-else
            v-for="item in listings"
            :key="item.id"
            class="flex gap-3 bg-white border border-slate-100 rounded-2xl p-3 hover:border-[#093A3F]/20 hover:shadow-md transition-all duration-200 group"
          >
            <!-- Cover -->
            <div class="w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-sm">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
                <BookOpen :size="24" />
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <p class="text-sm font-bold text-slate-800 truncate leading-tight">{{ item.title }}</p>
                <p class="text-[11px] text-slate-500 truncate">by {{ item.author }}</p>
                <div class="flex flex-wrap gap-1 mt-1.5">
                  <span :class="conditionClass(item.condition)" class="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                    {{ conditionLabel(item.condition) }}
                  </span>
                  <span :class="exchangeTypeClass(item.exchangeType)" class="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                    {{ item.exchangeType }}
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center gap-1 text-[10px] text-slate-400">
                  <MapPin :size="10" />
                  <span class="truncate max-w-[80px]">{{ item.location }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span v-if="item.price" class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    ${{ item.price }}
                  </span>
                  <button
                    v-if="isAuthenticated && item.owner?.id !== currentUser?.id"
                    @click="openContactModal(item)"
                    class="text-[10px] font-bold bg-amber-500/10 text-amber-700 hover:bg-amber-500 hover:text-white px-2 py-1 rounded-lg transition-all"
                  >
                    Contact
                  </button>
                  <span
                    v-if="item.owner?.id === currentUser?.id"
                    class="text-[10px] font-medium text-slate-400 italic"
                  >
                    Your listing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- ═══════════════════════════════════════════════
           RIGHT: Chat Panel
      ════════════════════════════════════════════════ -->
      <main
        :class="[
          activeTab === 'chat' ? 'flex' : 'hidden md:flex',
          'flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 flex-col overflow-hidden min-w-0 sticky top-4 h-[calc(100vh-160px)] md:h-[calc(100vh-97px)] self-start'
        ]"
      >
        <!-- Chat header -->
        <div class="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-2xl bg-[#093A3F]/10 flex items-center justify-center">
              <Hash :size="18" class="text-[#093A3F]" />
            </div>
            <div>
              <h2 class="font-bold text-sm text-[#093A3F] leading-tight"># book-exchange</h2>
              <p class="text-[10px] text-slate-500 font-medium">Discuss listings · Negotiate trades · Connect with readers</p>
            </div>
          </div>
          <!-- Online members count -->
          <div class="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-full">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            {{ onlineMembers.length }} online
          </div>
        </div>

        <!-- Messages -->
        <div
          ref="messageContainerRef"
          class="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/30"
        >
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 gap-3">
            <div class="w-7 h-7 border-2 border-[#093A3F] border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs text-slate-400 animate-pulse">Loading chat…</span>
          </div>

          <template v-else>
            <div v-if="messages.length === 0" class="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <MessageSquare :size="44" class="text-slate-300 mb-3" />
              <h3 class="font-bold text-sm text-slate-700">No messages yet</h3>
              <p class="text-xs mt-1">Start the conversation about a book listing!</p>
            </div>

            <div
              v-for="msg in messages"
              :key="msg.id"
              class="flex gap-3 items-start"
              :class="{ 'flex-row-reverse': isSelf(msg) }"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-inner flex-shrink-0">
                <img v-if="msg.user?.avatarUrl" :src="msg.user.avatarUrl" alt="avatar" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-[#093A3F]/10 text-[#093A3F] font-bold flex items-center justify-center text-xs">
                  {{ msg.user?.name?.charAt(0).toUpperCase() || 'U' }}
                </div>
              </div>
              <div class="flex flex-col max-w-[70%]" :class="{ 'items-end': isSelf(msg) }">
                <div class="flex items-center gap-1.5 mb-1 text-[10px]">
                  <span class="font-bold text-slate-700">{{ msg.user?.name || 'Reader' }}</span>
                  <span
                    v-if="getUserBadge(msg)"
                    class="font-bold px-1.5 py-0.5 rounded-sm scale-90 uppercase tracking-wider"
                    :class="badgeClass(getUserBadge(msg))"
                  >{{ getUserBadge(msg) }}</span>
                  <span class="text-slate-400 font-medium">{{ formatDate(msg.createdAt) }}</span>
                </div>
                <div
                  class="px-4 py-2.5 rounded-2xl shadow-sm leading-relaxed text-sm break-words whitespace-pre-wrap"
                  :class="isSelf(msg) ? 'bg-[#093A3F] text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'"
                >
                  {{ msg.content }}
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Input -->
        <div class="p-5 border-t border-slate-100 bg-white">
          <form v-if="isAuthenticated" @submit.prevent="sendMessage" class="flex gap-3 items-end">
            <div class="flex-1 bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200/60 focus-within:border-[#093A3F] rounded-2xl px-4 py-3 transition-all duration-200 flex items-center">
              <textarea
                v-model="newMessage"
                @keydown.enter.prevent="sendMessageOnEnter"
                placeholder="Chat about listings, ask questions, negotiate trades…"
                class="flex-1 bg-transparent border-none text-sm outline-none resize-none text-slate-700 max-h-20"
                rows="1"
                ref="inputRef"
              ></textarea>
            </div>
            <button
              type="submit"
              :disabled="isSending || !newMessage.trim()"
              class="w-11 h-11 rounded-2xl bg-[#093A3F] hover:bg-[#0E3B3E] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-[#093A3F]/10 hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <span v-if="isSending" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <Send v-else :size="16" class="ml-0.5" />
            </button>
          </form>
          <div v-else class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Lock :size="14" />
              </div>
              <div class="text-left">
                <p class="text-xs font-bold text-amber-900">Sign in to chat & list books</p>
                <p class="text-[10px] text-amber-700/80 font-medium">Join the community and start trading.</p>
              </div>
            </div>
            <button @click="router.push('/login')" class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-600/10">
              Log In Now
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- ═══════════════════════════════════════════════════
         POST BOOK MODAL
    ════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showPostModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closePostModal"
        >
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <!-- Modal header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-3xl">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <BookOpen :size="18" />
                </div>
                <div>
                  <h3 class="font-bold text-slate-800">List a Book</h3>
                  <p class="text-[10px] text-slate-400">Share a book you'd like to sell, swap or give away</p>
                </div>
              </div>
              <button @click="closePostModal" class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal form -->
            <form @submit.prevent="submitListing" class="p-6 space-y-4">
              <!-- Cover image upload -->
              <div>
                <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Book Cover <span class="text-red-500">*</span></label>
                <div
                  class="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:border-[#093A3F]/40 hover:bg-slate-50 transition-all"
                  @click="triggerFileInput"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop"
                >
                  <div v-if="coverPreview" class="flex justify-center">
                    <img :src="coverPreview" alt="preview" class="h-28 rounded-xl object-cover shadow-md" />
                  </div>
                  <div v-else class="py-4">
                    <ImageIcon :size="32" class="text-slate-300 mx-auto mb-2" />
                    <p class="text-xs text-slate-500 font-medium">Click to upload or drag & drop</p>
                    <p class="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
                </div>
              </div>

              <!-- Title + Author row -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Title <span class="text-red-500">*</span></label>
                  <input v-model="form.title" type="text" required placeholder="Book title" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#093A3F] transition-colors" />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Author <span class="text-red-500">*</span></label>
                  <input v-model="form.author" type="text" required placeholder="Author name" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#093A3F] transition-colors" />
                </div>
              </div>

              <!-- Condition + Type row -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Condition <span class="text-red-500">*</span></label>
                  <select v-model="form.condition" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#093A3F] transition-colors appearance-none cursor-pointer">
                    <option value="">Select…</option>
                    <option value="NEW">New</option>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="GOOD">Good</option>
                    <option value="ACCEPTABLE">Acceptable</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Type <span class="text-red-500">*</span></label>
                  <select v-model="form.exchangeType" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#093A3F] transition-colors appearance-none cursor-pointer">
                    <option value="">Select…</option>
                    <option value="SELL">Sell</option>
                    <option value="SWAP">Swap</option>
                    <option value="GIVEAWAY">Giveaway</option>
                  </select>
                </div>
              </div>

              <!-- Location + Price row -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Location <span class="text-red-500">*</span></label>
                  <input v-model="form.location" type="text" required placeholder="e.g. Bangkok" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#093A3F] transition-colors" />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Price (optional)</label>
                  <input v-model="form.price" type="number" min="0" step="0.01" placeholder="Leave blank if free" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#093A3F] transition-colors" />
                </div>
              </div>

              <!-- Trading For -->
              <div>
                <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Trading For <span class="text-red-500">*</span></label>
                <input v-model="form.tradingFor" type="text" required placeholder="e.g. Any fantasy novel, or cash" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#093A3F] transition-colors" />
              </div>

              <!-- Description -->
              <div>
                <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Description <span class="text-red-500">*</span></label>
                <textarea v-model="form.description" required rows="3" placeholder="Describe the book's condition, why you're listing it…" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#093A3F] transition-colors resize-none"></textarea>
              </div>

              <!-- Contact -->
              <div>
                <label class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Contact Number (optional)</label>
                <input v-model="form.contactNumber" type="text" placeholder="e.g. 0812345678" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#093A3F] transition-colors" />
              </div>

              <!-- Error message -->
              <p v-if="postError" class="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{{ postError }}</p>

              <!-- Actions -->
              <div class="flex gap-3 pt-2">
                <button type="button" @click="closePostModal" class="flex-1 border border-slate-200 text-slate-600 font-semibold text-sm py-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isPosting"
                  class="flex-1 bg-[#093A3F] hover:bg-[#0E3B3E] text-white font-bold text-sm py-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#093A3F]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span v-if="isPosting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{{ isPosting ? 'Posting…' : 'Post Listing' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════════════════════════════
         CONTACT MODAL
    ════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="contactItem"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="contactItem = null"
        >
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm">
            <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 class="font-bold text-slate-800">Contact Seller</h3>
              <button @click="contactItem = null" class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                <X :size="18" />
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex gap-3">
                <div class="w-14 h-18 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img v-if="contactItem.imageUrl" :src="contactItem.imageUrl" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="font-bold text-slate-800">{{ contactItem.title }}</p>
                  <p class="text-xs text-slate-500">by {{ contactItem.author }}</p>
                  <div class="flex gap-1 mt-1.5">
                    <span :class="conditionClass(contactItem.condition)" class="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">{{ conditionLabel(contactItem.condition) }}</span>
                    <span :class="exchangeTypeClass(contactItem.exchangeType)" class="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">{{ contactItem.exchangeType }}</span>
                  </div>
                </div>
              </div>
              <div class="bg-slate-50 rounded-2xl p-4 space-y-2">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Seller</p>
                <p class="text-sm font-semibold text-slate-800">{{ contactItem.owner?.name || 'Unknown' }}</p>
                <div v-if="contactItem.contactNumber" class="flex items-center gap-2">
                  <Phone :size="14" class="text-slate-400" />
                  <p class="text-sm text-slate-700">{{ contactItem.contactNumber }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <MapPin :size="14" class="text-slate-400" />
                  <p class="text-sm text-slate-700">{{ contactItem.location }}</p>
                </div>
                <div v-if="contactItem.price" class="flex items-center gap-2">
                  <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">Price: ${{ contactItem.price }}</span>
                </div>
              </div>
              <div class="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-3">
                <p class="text-xs text-amber-800 font-medium">💬 Tip: You can also send a message in the chat to discuss the exchange publicly!</p>
              </div>
              <button @click="sendContactChat(contactItem); contactItem = null" class="w-full bg-[#093A3F] text-white font-bold py-3 rounded-2xl hover:bg-[#0E3B3E] transition-all text-sm">
                💬 Mention in Chat
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth, token } from '../../stores/useAuth';
import { getChatMessages, sendChatMessage, type ChatMessage } from '../../services/chatApi';
import { exchangeService } from '../../services/exchange.service';
import type { ExchangeListing } from '../../types/exchange';
import {
  Hash, Send, MessageSquare, Lock, ArrowLeft, Sparkles,
  BookOpen, Plus, Search, MapPin, X, ImageIcon, Phone,
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const { user: currentUser } = useAuth();
const isAuthenticated = computed(() => Boolean(token.value));

const activeTab = ref<'listings' | 'chat'>('listings');

// ─── Listings ────────────────────────────────────────────
const listings = ref<ExchangeListing[]>([]);
const listingsLoading = ref(false);
const searchQuery = ref('');
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const fetchListings = async (search = '') => {
  listingsLoading.value = true;
  try {
    const res = await exchangeService.search({ search, limit: 50 });
    listings.value = res.data.data ?? [];
  } catch (e) {
    console.error('Failed to load listings', e);
  } finally {
    listingsLoading.value = false;
  }
};

const debounceSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => fetchListings(searchQuery.value), 400);
};

// ─── Post Modal ──────────────────────────────────────────
const showPostModal = ref(false);
const isPosting = ref(false);
const postError = ref('');
const coverFile = ref<File | null>(null);
const coverPreview = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const form = ref({
  title: '',
  author: '',
  condition: '',
  exchangeType: '',
  location: '',
  price: '',
  tradingFor: '',
  description: '',
  contactNumber: '',
});

const openPostModal = () => {
  postError.value = '';
  showPostModal.value = true;
};

const closePostModal = () => {
  showPostModal.value = false;
  coverFile.value = null;
  coverPreview.value = null;
  form.value = { title: '', author: '', condition: '', exchangeType: '', location: '', price: '', tradingFor: '', description: '', contactNumber: '' };
};

const triggerFileInput = () => fileInputRef.value?.click();

const setImagePreview = (file: File) => {
  coverFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => { coverPreview.value = e.target?.result as string; };
  reader.readAsDataURL(file);
};

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) setImagePreview(file);
};

const handleFileDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) setImagePreview(file);
};

const submitListing = async () => {
  postError.value = '';
  if (!coverFile.value) {
    postError.value = 'A book cover image is required.';
    return;
  }
  isPosting.value = true;
  try {
    const fd = new FormData();
    fd.append('image', coverFile.value);
    fd.append('title', form.value.title);
    fd.append('author', form.value.author);
    fd.append('condition', form.value.condition);
    fd.append('exchangeType', form.value.exchangeType);
    fd.append('location', form.value.location);
    fd.append('tradingFor', form.value.tradingFor);
    fd.append('description', form.value.description);
    if (form.value.price) fd.append('price', form.value.price);
    if (form.value.contactNumber) fd.append('contactNumber', form.value.contactNumber);

    await exchangeService.create(fd);
    closePostModal();
    await fetchListings(searchQuery.value);
  } catch (err: any) {
    postError.value = err?.response?.data?.message || 'Failed to post listing. Please try again.';
  } finally {
    isPosting.value = false;
  }
};

// ─── Contact Modal ───────────────────────────────────────
const contactItem = ref<ExchangeListing | null>(null);

const openContactModal = (item: ExchangeListing) => {
  contactItem.value = item;
};

const sendContactChat = (item: ExchangeListing) => {
  newMessage.value = `Hi! I'm interested in your book: "${item.title}" by ${item.author} (${item.exchangeType}). Is it still available?`;
  activeTab.value = 'chat';
  nextTick(() => {
    inputRef.value?.focus();
  });
};

// ─── Chat ─────────────────────────────────────────────────
const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const isSending = ref(false);
const isLoading = ref(false);
const messageContainerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);
let chatPollTimer: ReturnType<typeof setInterval> | null = null;
let listingsPollTimer: ReturnType<typeof setInterval> | null = null;

const onlineMembers = computed(() => {
  const members: Array<{ name: string; role: string }> = [];
  if (isAuthenticated.value && currentUser.value?.name) {
    members.push({ name: currentUser.value.name, role: currentUser.value.role ?? 'Reader' });
  }
  messages.value.forEach(msg => {
    if (msg.user?.name && !members.some(m => m.name.toLowerCase() === msg.user?.name?.toLowerCase())) {
      members.push({ name: msg.user.name, role: msg.user.role ?? 'Reader' });
    }
  });
  return members;
});

const isSelf = (msg: ChatMessage) => {
  if (!isAuthenticated.value || !currentUser.value) return false;
  return msg.userId === currentUser.value.id || msg.user?.id === currentUser.value.id;
};

const getUserBadge = (msg: ChatMessage) => msg.user?.role?.toLowerCase() || '';

const badgeClass = (badge: string) => {
  if (badge === 'admin') return 'bg-red-500/10 text-red-600 border border-red-500/20';
  if (badge === 'writer') return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
  return 'bg-[#093A3F]/10 text-[#093A3F] border border-[#093A3F]/20';
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
    if (d.toDateString() === now.toDateString()) return `Today at ${time}`;
    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at ${time}`;
  } catch { return 'Just now'; }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainerRef.value) {
    messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight;
  }
};

const fetchMessages = async (silent = false) => {
  if (!silent) isLoading.value = true;
  try {
    const data = await getChatMessages();
    const hadNew = data.length !== messages.value.length;
    messages.value = data;
    if (hadNew || !silent) await scrollToBottom();
  } catch (err) {
    console.error('Failed to load messages:', err);
  } finally {
    if (!silent) isLoading.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;
  const text = newMessage.value.trim();
  newMessage.value = '';
  isSending.value = true;
  try {
    const saved = await sendChatMessage(text);
    messages.value.push(saved);
    await scrollToBottom();
  } catch (err) {
    console.error('Failed to send:', err);
  } finally {
    isSending.value = false;
    inputRef.value?.focus();
  }
};

const sendMessageOnEnter = (e: KeyboardEvent) => {
  if (!e.shiftKey) sendMessage();
};

// ─── Badge/condition helpers ─────────────────────────────
const conditionLabel = (c: string) => {
  const map: Record<string, string> = { NEW: 'New', LIKE_NEW: 'Like New', GOOD: 'Good', ACCEPTABLE: 'Fair' };
  return map[c] ?? c;
};

const conditionClass = (c: string) => {
  if (c === 'NEW') return 'bg-emerald-100 text-emerald-700';
  if (c === 'LIKE_NEW') return 'bg-teal-100 text-teal-700';
  if (c === 'GOOD') return 'bg-blue-100 text-blue-700';
  return 'bg-slate-100 text-slate-600';
};

const exchangeTypeClass = (t: string) => {
  if (t === 'SELL') return 'bg-amber-100 text-amber-700';
  if (t === 'SWAP') return 'bg-purple-100 text-purple-700';
  if (t === 'GIVEAWAY') return 'bg-rose-100 text-rose-700';
  return 'bg-slate-100 text-slate-600';
};

// ─── Lifecycle ────────────────────────────────────────────
onMounted(() => {
  fetchMessages(false);
  fetchListings();

  chatPollTimer = setInterval(() => fetchMessages(true), 3000);
  listingsPollTimer = setInterval(() => fetchListings(searchQuery.value), 15000);

  // Check if routed with book details query parameters
  const { title, author, exchangeType } = route.query;
  if (title && author && exchangeType) {
    newMessage.value = `Hi! I'm interested in your book: "${title}" by ${author} (${exchangeType}). Is it still available?`;
    activeTab.value = 'chat';
    nextTick(() => {
      inputRef.value?.focus();
    });
    // Clean up query parameters to keep the URL clean
    router.replace({ path: '/chatbox', query: {} });
  }
});

onUnmounted(() => {
  if (chatPollTimer) clearInterval(chatPollTimer);
  if (listingsPollTimer) clearInterval(listingsPollTimer);
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active > div:last-child,
.modal-fade-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-fade-enter-from > div:last-child,
.modal-fade-leave-to > div:last-child {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>