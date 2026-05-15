<template>
  <main class="flex flex-col gap-3.5 min-w-0">

    <!-- Tab strip (scrollable on mobile) -->
    <div class="bg-white border border-black/[0.08] rounded-2xl p-1.5 flex relative shadow-sm overflow-x-auto sm:overflow-hidden scrollbar-hide">
      <button
        v-for="tab in tabs" :key="tab"
        @click="$emit('tab-change', tab)"
        :class="[
          'flex-none sm:flex-1 py-2 px-3 sm:px-1 rounded-xl text-[12px] font-medium transition-colors duration-200 relative z-10',
          activeTab === tab ? 'text-[#1c3a2e] font-semibold' : 'text-[#868080] hover:text-[#1c3a2e]'
        ]"
      >{{ tab }}</button>

      <!-- Sliding gold underline -->
      <div
        class="absolute bottom-[5px] h-[3px] bg-[#c5a050] rounded-full transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
        :style="{ left: tabs.indexOf(activeTab) * (100/tabs.length) + '%', width: (100/tabs.length) + '%' }"
      ></div>
    </div>

    <!-- Compose (collapses smoothly on scroll) -->
    <div
      class="overflow-hidden transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
      :class="composeHidden ? 'max-h-0 opacity-0 -mb-3.5' : 'max-h-[500px] opacity-100'"
    >
      <CommunityCompose @post-submitted="addPost" />
    </div>

    <!-- Scrollable posts area -->
    <div class="overflow-y-auto flex flex-col" style="max-height: calc(100vh - 260px)" @scroll="onScroll">
      <transition-group tag="div" class="flex flex-col gap-3 " name="post-fade">
        <PostCard
          v-for="post in visiblePosts"
          :key="post.id"
          :post="post"
          @like="likePost"
          @comment="addComment"
          @share="sharePost"
        />

        <!-- Load more -->
        <button
          v-if="showLoadMore"
          @click="loadMore"
          class="w-full py-3 rounded-xl border border-dashed border-black/[0.15] text-[13px] font-medium
                 text-[#868080] hover:border-[#c5a050] hover:text-[#1c3a2e] hover:bg-[#fdf6e8]
                 transition-all duration-150"
        >
          Load more posts
        </button>
      </transition-group>
    </div>

  </main>
</template>

<script>
import CommunityBanner  from './banner.vue'
import CommunityCompose from './compose.vue'
import PostCard         from './postcard.vue'

export default {
  name: 'CommunityFeed',
  components: { CommunityBanner, CommunityCompose, PostCard },
  props: { activeTab: { type: String, default: 'For You' } },
  emits: ['tab-change'],

  data() {
    return {
      tabs: ['For You', 'Following', 'Reviews', 'Discussions', 'Stories'],
      visibleCount: 4,
      composeHidden: false,
      allPosts: [
        {
          id: 1, author: 'Dara Samnang', initials: 'DS', avaColor: '#1c3a2e',
          badge: 'Author', badgeType: 'author', time: '2h ago', category: 'Fiction',
          text: 'Just published Chapter 12 of "The River Speaks" — this one took me three rewrites. The hardest scenes to write are always the quiet ones. Silence in fiction is louder than you think. 📖',
          book: null, images: null, poll: null,
          likes: 84, liked: false, shares: 12, saved: false,
          showComments: false, newComment: '', textExpanded: false,
          comments: [
            { id: 1, author: 'Sokha M.', initials: 'SM', avaColor: '#c5a050', text: 'The quiet scene in chapter 11 stayed with me for days!', time: '1h ago' },
            { id: 2, author: 'Leakna R.', initials: 'LR', avaColor: '#7a3d92', text: 'Your prose just keeps getting better. Sharing this now.', time: '45m ago' },
          ],
        },
        {
          id: 2, author: 'Leakna Rath', initials: 'LR', avaColor: '#7a3d92',
          badge: 'Poet', badgeType: 'poet', time: '5h ago', category: 'Review',
          text: 'Finished "Milk and Honey" — a stunning collection on survival, healing, and love. Reading poetry that actually breathes makes me want to write again. Has anyone read the second collection?',
          book: { title: 'Milk and Honey', author: 'Rupi Kaur', rating: 5, coverBg: '#1c1c1c' },
          images: null, poll: null,
          likes: 134, liked: true, shares: 27, saved: true,
          showComments: false, newComment: '', textExpanded: false,
          comments: [
            { id: 1, author: 'Chan D.', initials: 'CD', avaColor: '#1c3a2e', text: '"The Sun and Her Flowers" is even more personal — read both back to back.', time: '4h ago' },
          ],
        },
        {
          id: 3, author: 'Vutha Prak', initials: 'VP', avaColor: '#3a5fa5',
          badge: 'Historian', badgeType: 'historian', time: '1d ago', category: 'Discussion',
          text: 'Started a reading group for Cambodian history books. 8 members, every Saturday 10AM at the National Library. DM to join! Books on the list: A Record of Cambodia, The Gate, First They Killed My Father.',
          book: null, images: ['#d4e8f0', '#e0dbd0'], poll: null,
          likes: 67, liked: false, shares: 31, saved: false,
          showComments: false, newComment: '', comments: [], textExpanded: false,
        },
        {
          id: 4, author: 'Sokha Meas', initials: 'SM', avaColor: '#c5a050',
          badge: null, badgeType: '', time: '1d ago', category: 'Review',
          text: '"The Art of War" — 2,500 years of wisdom in 80 pages. Every sentence earns its place. Sun Tzu would have been an excellent editor. Just gave it 5 stars in the library.',
          book: { title: 'The Art of War', author: 'Sun Tzu', rating: 5, coverBg: '#2c1810' },
          images: null, poll: null,
          likes: 211, liked: false, shares: 44, saved: false,
          showComments: false, newComment: '', textExpanded: false,
          comments: [
            { id: 1, author: 'Dara S.', initials: 'DS', avaColor: '#1c3a2e', text: 'The Cleary translation is phenomenal. The chapter on adaptability applies directly to writing.', time: '20h ago' },
            { id: 2, author: 'Vutha P.', initials: 'VP', avaColor: '#3a5fa5', text: 'Changed how I approach every project I work on.', time: '18h ago' },
          ],
        },
        {
          id: 5, author: 'Chan Dara', initials: 'CD', avaColor: '#0f6e56',
          badge: 'Writer', badgeType: 'author', time: '2d ago', category: 'Discussion',
          text: 'Quick poll for the reading group — what should we tackle next month?',
          book: null, images: null,
          poll: {
            question: "Next month's group read?",
            voted: null, total: 47, remaining: '3 days left',
            options: [
              { label: 'Sapiens — Yuval Noah Harari', pct: 42 },
              { label: 'The Kite Runner — Khaled Hosseini', pct: 35 },
              { label: 'Educated — Tara Westover', pct: 23 },
            ],
          },
          likes: 38, liked: false, shares: 9, saved: false,
          showComments: false, newComment: '', comments: [], textExpanded: false,
        },
      ],
    }
  },

  computed: {
    visiblePosts() {
      let p = this.allPosts
      if (this.activeTab === 'Reviews')     p = p.filter(x => x.category === 'Review')
      if (this.activeTab === 'Discussions') p = p.filter(x => x.category === 'Discussion')
      if (this.activeTab === 'Stories')     p = p.filter(x => x.category === 'Fiction')
      if (this.activeTab === 'Following')   p = p.filter(x => x.likes > 100)
      return p.slice(0, this.visibleCount)
    },
    showLoadMore() { return this.visibleCount < this.allPosts.length },
  },

  methods: {
    addPost(text) {
      this.allPosts.unshift({
        id: Date.now(), author: 'Sophal Prak', initials: 'SP', avaColor: '#1c3a2e',
        badge: 'Writer', badgeType: 'author', time: 'Just now', category: 'Discussion',
        text, book: null, images: null, poll: null,
        likes: 0, liked: false, shares: 0, saved: false,
        showComments: false, newComment: '', comments: [], textExpanded: false,
      })
    },
    likePost(post)           { post.liked = !post.liked; post.likes += post.liked ? 1 : -1 },
    addComment({ post, text }) {
      post.comments.push({ id: Date.now(), author: 'Sophal Prak', initials: 'SP', avaColor: '#1c3a2e', text, time: 'Just now' })
    },
    sharePost(post)          { post.shares++ },
    loadMore()               { this.visibleCount += 3 },
    onScroll(e)              { this.composeHidden = e.target.scrollTop > 60 },
  },
}
</script>

<style scoped>
.post-fade-enter-active { animation: postIn 0.3s cubic-bezier(.4,0,.2,1); }
@keyframes postIn {
  from { opacity: 0; transform: translateY(12px) scale(0.99); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.post-fade-leave-active { transition: opacity 0.15s; }
.post-fade-leave-to { opacity: 0; }
</style>