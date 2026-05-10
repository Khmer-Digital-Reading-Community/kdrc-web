<template>
  <div :class="[
    'bg-white border rounded-2xl p-4 transition-all duration-200',
    expanded
      ? 'border-black/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.09)]'
      : 'border-black/[0.08] shadow-sm'
  ]">

    <!-- Top row -->
    <div class="flex gap-3 items-start">
      <!-- Avatar -->
      <div class="w-9 h-9 rounded-full bg-[#1c3a2e] text-[#c5a050] text-[12px] font-semibold flex items-center justify-center flex-none">
        SP
      </div>

      <!-- Textarea -->
      <textarea
        v-model="text"
        :placeholder="expanded ? 'What\'s on your reading list?' : 'Share a thought, review, or story…'"
        :rows="expanded ? 3 : 1"
        @focus="expanded = true"
        class="flex-1 border border-black/[0.12] rounded-xl px-3.5 py-2.5 text-[13.5px]
               text-[#3a3a3a] bg-[#f5f1ea] resize-none outline-none leading-relaxed
               placeholder-[#c0bbb2] transition-all duration-200 min-h-[42px]
               focus:border-[#c5a050] focus:bg-white"
      ></textarea>
    </div>

    <!-- Toolbar (animated) -->
    <transition
      enter-active-class="transition-all duration-200 ease-out overflow-hidden"
      leave-active-class="transition-all duration-150 ease-in overflow-hidden"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[80px]"
      leave-from-class="opacity-100 max-h-[80px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="expanded" class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-black/[0.06]">

        <!-- Tools -->
        <div class="flex gap-1 flex-wrap">
          <button
            v-for="tool in tools" :key="tool.label"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium
                   text-[#868080] hover:bg-[#f5f1ea] hover:text-[#1c3a2e] transition-all duration-150"
            v-html="tool.icon + `<span>${tool.label}</span>`"
          ></button>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button
            @click="cancel"
            class="px-3.5 py-1.5 rounded-lg border border-black/[0.12] text-[12px] font-medium
                   text-[#868080] hover:bg-[#f5f1ea] hover:text-[#1c3a2e] transition-all duration-150"
          >Cancel</button>
          <button
            @click="submit"
            :disabled="!text.trim()"
            class="px-5 py-1.5 rounded-lg bg-[#1c3a2e] text-white text-[13px] font-semibold
                   hover:bg-[#142c22] active:scale-95 transition-all duration-150
                   disabled:opacity-40 disabled:cursor-not-allowed"
          >Post</button>
        </div>

      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'CommunityCompose',
  emits: ['post-submitted'],
  data() {
    return {
      text: '',
      expanded: false,
      tools: [
        {
          label: 'Photo',
          icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path stroke-linecap="round" d="M21 15l-5-5L5 21"/></svg>`,
        },
        {
          label: 'Tag Book',
          icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg>`,
        },
        {
          label: 'Poll',
          icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
        },
      ],
    }
  },
  methods: {
    cancel() { this.text = ''; this.expanded = false },
    submit() {
      if (!this.text.trim()) return
      this.$emit('post-submitted', this.text.trim())
      this.text = ''; this.expanded = false
    },
  },
}
</script>