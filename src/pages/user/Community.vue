<template>
  <div class="min-h-screen bg-[#faf8f3] font-['DM_Sans',sans-serif]">
    <!-- Page shell -->
    <div class="max-w-[1340px] mx-auto px-4 sm:px-5 md:px-7 py-4 sm:py-6
                grid grid-cols-1 gap-4 sm:gap-5 items-start
                lg:grid-cols-[1fr_280px]
                xl:grid-cols-[200px_1fr_270px]
                pb-24 md:pb-6">

      <!-- Left nav — hidden on mobile/tablet, visible on large screens -->
      <LeftSideBar
        class="hidden xl:block"
        :active-nav="activeNav"
        @navigate="activeNav = $event"
      />

      <!-- Main feed -->
      <feed :active-tab="activeTab" @tab-change="activeTab = $event" />

      <!-- Right sidebar — hidden on tablet and below -->
      <sidebar class="hidden lg:flex" />

    </div>

    <!-- Bottom nav — visible only on mobile/tablet (replaces left nav) -->
    <bottom :active-nav="activeNav" @navigate="activeNav = $event" />

  </div>
</template>

<script>
import LeftSideBar from '../../components/communitys/LeftSideBar.vue';
import feed from '../../components/communitys/feed.vue';
import sidebar from '../../components/communitys/sidebar.vue';
import bottom from '../../components/communitys/bottom.vue'


export default {
  name: 'CommunityPage',
  components: { feed, sidebar, bottom, LeftSideBar },
  data() {
    return {
      activeNav: 'Feed',
      activeTab: 'For You',
    }
  },
}
</script>