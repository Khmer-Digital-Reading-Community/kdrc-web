<template>
  <aside class="w-[240px] flex-none border-r border-[#e8e4dc] py-8 px-5 flex flex-col gap-8 sticky top-0 h-screen overflow-y-auto">

    <!-- Live Activity -->
    <div>
      <div class="flex items-center gap-2 mb-4">
        <span class="text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">Live Activity</span>
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      <div class="flex flex-col gap-3">
        <div
          v-for="activity in liveActivities"
          :key="activity.id"
          class="bg-white border border-[#e8e4dc] rounded-xl px-3 py-2.5 shadow-sm"
        >
          <p class="text-[13px] text-gray-700">
            <span class="font-semibold">{{ activity.user }}</span>
            posted to
            <span
              :class="{
                'text-emerald-600 font-bold': activity.type === 'SWAP',
                'text-blue-500 font-bold': activity.type === 'LEND',
                'text-[#c5a050] font-bold': activity.type === 'SELL',
              }"
            >{{ activity.type }}</span>
          </p>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ activity.ago }}</p>
        </div>
      </div>
    </div>

    <!-- Top Contributors -->
    <div>
      <p class="text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase mb-4">
        Top Contributors
      </p>
      <div class="flex flex-col gap-3">
        <div
          v-for="(user, i) in topContributors"
          :key="user.name"
          class="flex items-center gap-3 group cursor-pointer"
        >
          <div class="relative flex-none">
            <div
              :class="[
                'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white absolute -top-1 -left-1 z-10',
                i === 0 ? 'bg-[#c5a050]' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'
              ]"
            >{{ i + 1 }}</div>
            <img
              :src="user.avatar"
              :alt="user.name"
              class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>
          <div>
            <p class="text-[13px] font-semibold text-gray-800 group-hover:text-[#1c3a2e] transition-colors">
              {{ user.name }}
            </p>
            <p class="text-[11px] font-bold text-[#c5a050]">{{ user.swaps }} SWAPS</p>
          </div>
        </div>
      </div>
      <button class="mt-4 text-[11px] font-bold tracking-[0.1em] text-[#c5a050] uppercase hover:text-[#1c3a2e] transition-colors">
        View Leaderboard
      </button>
    </div>

  </aside>
</template>

<script>
export default {
  name: 'CommunitySidebar',
  props: {
    liveActivities: {
      type: Array,
      required: true
    },
    topContributors: {
      type: Array,
      required: true
    }
  }
}
</script>
