<template>
  <div class="bg-white border border-[#e0ddd6] rounded-xl p-1 mb-6 flex overflow-x-auto scrollbar-hide">
    <button
      v-for="tab in tabs" :key="tab.key"
      @click="$emit('navigate', tab.key)"
      :class="[
        'flex-1 py-2.5 px-3 rounded-lg text-[13px] font-medium transition-all duration-200 whitespace-nowrap',
        activeNav === tab.key
          ? 'bg-[#1a3330] text-white'
          : 'text-[#8a8580] hover:text-[#1a3330] hover:bg-[#f5f3ee]'
      ]"
    >{{ tab.label }}</button>
  </div>
</template>

<script>
export default {
  name: 'ChallengeHeader',
  props: {
    activeNav: { type: String, default: 'Challenges' },
    isAuthenticated: { type: Boolean, default: false },
  },
  emits: ['navigate'],
  computed: {
    tabs() {
      const allTabs = [
        { key: 'Challenges', label: 'Challenges' },
        { key: 'Achievements', label: 'Achievements' },
        { key: 'Leaderboard', label: 'Leaderboard' },
        { key: 'My Stats', label: 'My Stats' },
      ]
      return this.isAuthenticated ? allTabs : allTabs.filter(t => t.key === 'Challenges' || t.key === 'Leaderboard')
    },
  },
}
</script>
