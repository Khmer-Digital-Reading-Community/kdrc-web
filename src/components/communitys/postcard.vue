<template>
  <article class="bg-white border border-black/[0.08] rounded-2xl px-4 sm:px-5 py-4 shadow-sm
                  hover:shadow-md hover:border-black/[0.12] transition-all duration-200">

    <!-- Header -->
    <div class="flex items-start gap-3 mb-3.5">
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold flex-none"
        :style="{ background: post.avaColor }"
      >{{ post.initials }}</div>

      <div class="flex-1">
        <div class="flex items-center gap-2 mb-0.5">
          <span class="font-['Syne',sans-serif] text-[14px] font-semibold text-[#1c3a2e]">
            {{ post.author }}
          </span>
          <span
            v-if="post.badge"
            :class="[
              'text-[9px] font-semibold tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-md',
              post.badgeType === 'author'    ? 'bg-[#e4eeea] text-[#1a4a30]' :
              post.badgeType === 'poet'      ? 'bg-[#ede5f4] text-[#622a86]' :
                                               'bg-[#e4edf8] text-[#1c3f86]'
            ]"
          >{{ post.badge }}</span>
        </div>
        <span class="text-[11px] text-[#c0bbb2]">{{ post.time }} · {{ post.category }}</span>
      </div>

      <button class="text-[#c0bbb2] hover:text-[#868080] text-lg px-1 leading-none transition-colors rounded-md">···</button>
    </div>

    <!-- Text -->
    <div>
      <p ref="textEl"
         class="font-['Lora',serif] text-[14.5px] leading-[1.78] text-[#3a3a3a]"
         :class="{ 'line-clamp-2': !post.textExpanded }"
      >{{ post.text }}</p>
      <button
        v-if="textTruncated"
        @click="post.textExpanded = !post.textExpanded"
        class="text-[12px] font-semibold text-[#c5a050] hover:text-[#1c3a2e] transition-colors mt-1 mb-3"
      >{{ post.textExpanded ? 'Show less' : 'See more' }}</button>
    </div>

    <!-- Book embed -->
    <div v-if="post.book" class="flex gap-3 items-center bg-[#f5f1ea] border border-black/[0.1] rounded-xl p-3 mb-3">
      <div
        class="w-11 h-[60px] rounded-md flex items-center justify-center flex-none"
        :style="{ background: post.book.coverBg }"
      >
        <span class="font-['Lora',serif] text-[10px] font-bold text-[#c5a050] [writing-mode:vertical-rl] rotate-180 tracking-wider">
          {{ post.book.title.slice(0, 4) }}
        </span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[10px] text-[#c0bbb2] mb-0.5">📖 Book mention</p>
        <p class="text-[13px] font-semibold text-[#1c3a2e] leading-snug">{{ post.book.title }}</p>
        <p class="text-[11px] text-[#868080] mb-1.5">by {{ post.book.author }}</p>
        <div class="flex gap-0.5">
          <span v-for="n in 5" :key="n" :class="['text-[13px]', n <= post.book.rating ? 'text-[#c5a050]' : 'text-[#e0dbd0]']">★</span>
        </div>
      </div>
      <button class="text-[12px] font-semibold text-[#1c3a2e] border border-black/[0.12] px-3 py-1.5
                     rounded-lg hover:bg-[#1c3a2e] hover:text-white hover:border-[#1c3a2e] transition-all duration-150 flex-none">
        Read →
      </button>
    </div>

    <!-- Images -->
    <div v-if="post.images" :class="['grid gap-1.5 rounded-xl overflow-hidden mb-3', post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2']">
      <div
        v-for="(c, i) in post.images" :key="i"
        class="h-32 rounded-lg flex items-center justify-center"
        :style="{ background: c }"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.3">
          <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <path stroke-linecap="round" d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
    </div>

    <!-- Poll -->
    <div v-if="post.poll" class="bg-[#f5f1ea] border border-black/[0.1] rounded-xl p-3.5 mb-3">
      <p class="text-[13px] font-semibold text-[#1c3a2e] mb-2.5">{{ post.poll.question }}</p>
      <div
        v-for="(opt, oi) in post.poll.options" :key="oi"
        @click="castVote(oi)"
        :class="[
          'relative flex items-center bg-white border rounded-lg px-3 py-2 mb-1.5 cursor-pointer overflow-hidden transition-colors duration-150',
          post.poll.voted === oi ? 'border-[#1c3a2e]' : 'border-black/[0.1] hover:border-[#c5a050]'
        ]"
      >
        <div
          class="absolute left-0 top-0 bottom-0 bg-[#1c3a2e]/[0.07] rounded-lg transition-all duration-500"
          :style="{ width: post.poll.voted !== null ? opt.pct + '%' : '0%' }"
        ></div>
        <span class="text-[12px] font-medium text-[#3a3a3a] flex-1 relative z-10">{{ opt.label }}</span>
        <span v-if="post.poll.voted !== null" class="text-[11px] font-bold text-[#1c3a2e] relative z-10">{{ opt.pct }}%</span>
      </div>
      <p class="text-[11px] text-[#c0bbb2] mt-1">{{ post.poll.total }} votes · {{ post.poll.remaining }}</p>
    </div>

    <!-- Footer actions -->
    <div class="border-t border-black/[0.05] pt-2.5 flex items-center gap-1 flex-wrap">

      <!-- Like -->
      <button
        @click="$emit('like', post)"
        :class="[
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150',
          post.liked
            ? 'text-[#e24b4a] hover:bg-red-50'
            : 'text-[#868080] hover:bg-[#f5f1ea] hover:text-[#1c3a2e]'
        ]"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        {{ post.likes }}
      </button>

      <!-- Comment -->
      <button
        @click="post.showComments = !post.showComments"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium
               text-[#868080] hover:bg-[#f5f1ea] hover:text-[#1c3a2e] transition-all duration-150"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        {{ post.comments.length }}
      </button>

      <!-- Share -->
      <button
        @click="$emit('share', post)"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium
               text-[#868080] hover:bg-[#f5f1ea] hover:text-[#1c3a2e] transition-all duration-150"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        {{ post.shares }}
      </button>

      <!-- Bookmark -->
      <button
        @click="post.saved = !post.saved"
        :class="[
          'ml-auto flex items-center justify-center px-2.5 py-1.5 rounded-lg transition-all duration-150',
          post.saved
            ? 'text-[#c5a050] hover:bg-[#fdf6e8]'
            : 'text-[#c0bbb2] hover:bg-[#f5f1ea] hover:text-[#1c3a2e]'
        ]"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" :fill="post.saved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z"/>
        </svg>
      </button>
    </div>

    <!-- Comments drawer -->
    <transition
      enter-active-class="transition-all duration-200 ease-out overflow-hidden"
      leave-active-class="transition-all duration-150 ease-in overflow-hidden"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[600px]"
      leave-from-class="opacity-100 max-h-[600px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="post.showComments" class="border-t border-black/[0.05] pt-3.5 mt-2.5 flex flex-col gap-2.5">

        <!-- Comment input -->
        <div class="flex gap-2 items-center">
          <div class="w-7 h-7 rounded-full bg-[#1c3a2e] text-[#c5a050] text-[10px] font-semibold flex items-center justify-center flex-none">
            SP
          </div>
          <input
            class="flex-1 bg-[#f5f1ea] border border-transparent rounded-full px-4 py-1.5
                   text-[12px] text-[#3a3a3a] outline-none placeholder-[#c0bbb2]
                   focus:border-[#c5a050] focus:bg-white transition-all duration-150"
            placeholder="Write a comment…"
            v-model="post.newComment"
            @keydown.enter="submitComment"
          />
          <button
            @click="submitComment"
            class="w-7 h-7 rounded-full bg-[#1c3a2e] text-white flex items-center justify-center
                   hover:bg-[#c5a050] transition-colors duration-150 flex-none"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>

        <!-- Comment list -->
        <div v-for="c in post.comments" :key="c.id" class="flex gap-2 items-start">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-none"
            :style="{ background: c.avaColor }"
          >{{ c.initials }}</div>
          <div class="bg-[#f5f1ea] rounded-2xl rounded-tl-sm px-3 py-2 flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[12px] font-semibold text-[#1c3a2e]">{{ c.author }}</span>
              <span class="text-[10px] text-[#c0bbb2]">{{ c.time }}</span>
            </div>
            <p class="text-[12px] text-[#3a3a3a] leading-relaxed">{{ c.text }}</p>
          </div>
        </div>

      </div>
    </transition>

  </article>
</template>

<script>
export default {
  name: 'PostCard',
  props: { post: { type: Object, required: true } },
  emits: ['like', 'comment', 'share'],
  data() {
    return { textTruncated: false }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.textEl) {
        this.textTruncated = this.$refs.textEl.scrollHeight > this.$refs.textEl.clientHeight
      }
    })
  },
  methods: {
    castVote(idx) {
      if (this.post.poll.voted !== null) return
      this.post.poll.voted = idx
      this.post.poll.total++
    },
    submitComment() {
      if (!this.post.newComment?.trim()) return
      this.$emit('comment', { post: this.post, text: this.post.newComment.trim() })
      this.post.newComment = ''
    },
  },
}
</script>