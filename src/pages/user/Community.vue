<template>
  <div class="min-h-screen bg-[#f5f3ee] pb-24 md:pb-12">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
      <!-- ───── VISITOR HERO ───── -->
      <template v-if="!isAuthenticated && !loading">
        <div class="bg-[#093A3F] rounded-xl p-8 mb-6">
          <div class="flex flex-col lg:flex-row items-start gap-8">
            <div class="flex-1">
              <p
                class="text-[#c8861a] text-xs font-medium uppercase tracking-widest mb-3"
              >
                Khmer Digital Reading Community
              </p>
              <h1 class="text-[32px] leading-tight font-medium text-white mb-3">
                Read. Write.<br />Challenge yourself.
              </h1>
              <p class="text-[#b8b0a8] text-sm leading-relaxed max-w-md mb-6">
                Join a community of Khmer readers and writers. Take on reading
                challenges, track your progress, and earn achievements.
              </p>
              <div class="flex items-center gap-4">
                <router-link
                  to="/signup"
                  class="bg-[#c8861a] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#b87812] transition-colors"
                  >Get started free</router-link
                >
                <router-link
                  to="/login"
                  class="text-[#b8b0a8] text-sm font-medium hover:text-white transition-colors"
                  >Already a member? Sign in</router-link
                >
              </div>
            </div>
            <div class="w-full lg:w-72 flex-none">
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="s in heroStats"
                  :key="s.label"
                  class="bg-white/10 rounded-lg px-4 py-4 text-center"
                >
                  <p class="text-2xl font-medium text-white">{{ s.val }}</p>
                  <p class="text-[11px] text-[#b8b0a8] mt-1">{{ s.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visitor stats row -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div
            v-for="s in publicStats"
            :key="s.label"
            class="bg-white border border-[#e0ddd6] rounded-xl px-5 py-4"
          >
            <div class="flex items-baseline justify-between">
              <p class="text-2xl font-medium text-[#1a3330]">{{ s.val }}</p>
              <span class="text-[11px] font-medium text-green-700"
                >▲ {{ s.delta }}</span
              >
            </div>
            <p class="text-[12px] text-[#8a8580] mt-0.5">{{ s.label }}</p>
          </div>
        </div>

        <!-- Preview section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white border border-[#e0ddd6] rounded-xl p-6">
            <h3 class="text-sm font-medium text-[#1a3330] mb-4">Top Readers</h3>
            <div class="space-y-3">
              <div
                v-for="i in 3"
                :key="i"
                class="flex items-center gap-3 opacity-60"
              >
                <span
                  class="w-6 text-center text-xs font-medium text-[#8a8580]"
                  >{{ i }}</span
                >
                <div class="w-8 h-8 rounded-full bg-[#e8e3dc]"></div>
                <div class="flex-1 h-3 bg-[#e8e3dc] rounded w-24"></div>
                <div class="h-3 bg-[#e8e3dc] rounded w-12"></div>
              </div>
            </div>
            <div class="mt-5 pt-4 border-t border-[#e0ddd6] text-center">
              <router-link
                to="/login"
                class="text-[#c8861a] text-xs font-medium"
                >Sign in to view full leaderboard</router-link
              >
            </div>
          </div>
          <div class="bg-white border border-[#e0ddd6] rounded-xl p-6">
            <h3 class="text-sm font-medium text-[#1a3330] mb-4">
              Active Challenges
            </h3>
            <div class="space-y-4">
              <div
                v-for="i in 2"
                :key="i"
                class="flex items-center gap-3 opacity-60"
              >
                <div class="w-10 h-10 rounded-lg bg-[#e8e3dc]"></div>
                <div class="flex-1">
                  <div class="h-3 bg-[#e8e3dc] rounded w-32 mb-2"></div>
                  <div class="h-2 bg-[#e8e3dc] rounded w-24"></div>
                </div>
              </div>
            </div>
            <div class="mt-5 pt-4 border-t border-[#e0ddd6] text-center">
              <router-link
                to="/login"
                class="text-[#c8861a] text-xs font-medium"
                >Sign in to join challenges</router-link
              >
            </div>
          </div>
        </div>
      </template>

      <!-- ───── AUTHENTICATED HEADER ───── -->
      <ChallengeHeader
        :active-nav="activeNav"
        :is-authenticated="isAuthenticated"
        @navigate="activeNav = $event"
      />

      <!-- ───── LOADING ───── -->
      <div v-if="loading" class="text-center py-16">
        <div
          class="inline-block w-8 h-8 border-2 border-[#c8861a] border-t-transparent rounded-full animate-spin mb-3"
        ></div>
        <p class="text-[13px] text-[#8a8580]">Loading...</p>
      </div>

      <!-- ───── ERROR ───── -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-xl p-4 text-center"
      >
        <p class="text-[13px] text-red-600">{{ error }}</p>
        <button
          @click="fetchAll"
          class="mt-2 text-[12px] font-medium text-[#1a3330] underline"
        >
          Try again
        </button>
      </div>

      <!-- ───── CHALLENGES TAB (AUTHENTICATED) ───── -->
      <template v-else-if="activeNav === 'Challenges' && isAuthenticated">
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div
            v-for="s in miniStats"
            :key="s.label"
            :class="[
              'bg-white border border-[#e0ddd6] rounded-xl px-4 py-4',
              s.highlight ? 'border-[#c8861a]' : '',
            ]"
          >
            <p class="text-2xl font-medium text-[#1a3330] leading-none">
              {{ s.val }}
            </p>
            <p class="text-[11px] text-[#8a8580] mt-1.5">{{ s.label }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <ActiveChallenge
              v-if="joinedChallenges.length"
              :challenges="allChallenges"
            />
            <ChallengeGrid
              :challenges="availableChallenges"
              @join="handleJoin"
            />
            <CurrentlyReading />
          </div>
          <div class="space-y-6">
            <div class="bg-white border border-[#e0ddd6] rounded-xl p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-[#1a3330]">
                  My Achievements
                </h3>
                <button
                  @click="activeNav = 'Achievements'"
                  class="text-[11px] font-medium text-[#c8861a]"
                >
                  See all
                </button>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="badge in achievementsPreview"
                  :key="badge.id"
                  class="rounded-lg border border-[#e0ddd6] p-3 text-center"
                  :class="badge.earned ? '' : 'opacity-40'"
                >
                  <span
                    v-html="badge.icon"
                    class="block mb-1"
                    :style="{ color: badge.earned ? badge.color : '#c0bbb2' }"
                  ></span>
                  <p
                    class="text-[10px] font-medium text-[#1a3330] leading-tight"
                  >
                    {{ badge.name }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-white border border-[#e0ddd6] rounded-xl p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-[#1a3330]">Leaderboard</h3>
                <button
                  @click="activeNav = 'Leaderboard'"
                  class="text-[11px] font-medium text-[#c8861a]"
                >
                  Full ranking
                </button>
              </div>
              <div class="flex gap-1 mb-4">
                <button
                  v-for="t in leaderboardTabs"
                  :key="t.key"
                  @click="handleTabChange(t.key)"
                  :class="[
                    'text-[10px] font-medium px-2.5 py-1 rounded-lg transition-colors',
                    activeTab === t.key
                      ? 'bg-[#1a3330] text-white'
                      : 'bg-[#f5f3ee] text-[#8a8580]',
                  ]"
                >
                  {{ t.label }}
                </button>
              </div>
              <div class="space-y-2.5">
                <div
                  v-for="(r, i) in leaderboard.slice(0, 3)"
                  :key="r.rank"
                  class="flex items-center gap-2.5"
                >
                  <span
                    class="w-5 text-center text-xs font-medium text-[#8a8580]"
                  >
                    <span v-if="i === 0">🥇</span>
                    <span v-else-if="i === 1">🥈</span>
                    <span v-else-if="i === 2">🥉</span>
                    <span v-else>{{ r.rank }}</span>
                  </span>
                  <div
                    class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-medium flex-none"
                    :style="{ background: r.color }"
                  >
                    {{ r.initials }}
                  </div>
                  <p class="flex-1 text-xs font-medium text-[#1a3330] truncate">
                    {{ r.name }}
                  </p>
                  <p class="text-xs font-medium text-[#1a3330]">
                    {{ statValue(r) }}
                  </p>
                </div>
              </div>
              <div
                v-if="myLeaderboardRank"
                class="mt-3 pt-3 border-t border-[#e0ddd6]"
              >
                <div
                  class="flex items-center gap-2.5 bg-[#fdf4dc] rounded-lg px-3 py-2"
                >
                  <span
                    class="w-5 text-center text-xs font-medium text-[#c8861a]"
                    >{{ myLeaderboardRank.rank }}</span
                  >
                  <div
                    class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-medium flex-none"
                    :style="{ background: myLeaderboardRank.color }"
                  >
                    {{ myLeaderboardRank.initials }}
                  </div>
                  <p class="flex-1 text-xs font-medium text-[#1a3330] truncate">
                    {{ myLeaderboardRank.name }}
                  </p>
                  <p class="text-xs font-medium text-[#c8861a]">
                    {{ statValue(myLeaderboardRank) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ───── CHALLENGES TAB (VISITOR) ───── -->
      <template v-else-if="activeNav === 'Challenges' && !isAuthenticated">
        <ChallengeGrid :challenges="allChallenges" @join="handleJoin" />
      </template>

      <!-- ───── ACHIEVEMENTS TAB ───── -->
      <AchievementsGrid
        v-else-if="activeNav === 'Achievements'"
        :achievements="achievements"
      />

      <!-- ───── LEADERBOARD TAB ───── -->
      <LeaderboardTable
        v-else-if="activeNav === 'Leaderboard'"
        :readers="leaderboard"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

      <!-- ───── MY STATS TAB ───── -->
      <template v-else-if="activeNav === 'My Stats'">
        <MyStats v-if="isAuthenticated" />
        <div
          v-else
          class="text-center py-16 bg-white border border-[#e0ddd6] rounded-xl"
        >
          <div class="flex justify-center mb-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c0bbb2"
              stroke-width="1.2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <p class="text-[15px] font-medium text-[#1a3330] mb-1">
            Sign in to see your stats
          </p>
          <p class="text-[13px] text-[#8a8580] mb-5">
            Track your reading progress and earn achievements.
          </p>
          <router-link
            to="/login"
            class="inline-block bg-[#1a3330] text-white px-6 py-2.5 rounded-lg text-[13px] font-medium hover:bg-[#142c22] transition-colors"
            >Sign In</router-link
          >
        </div>
      </template>
    </div>
    <!-- <BottomNav :active-nav="activeNav" :is-authenticated="isAuthenticated" @navigate="activeNav = $event" /> -->
  </div>
</template>

<script>
import ChallengeHeader from "../../components/challenges/ChallengeHeader.vue";
import ActiveChallenge from "../../components/challenges/ActiveChallenge.vue";
import ChallengeGrid from "../../components/challenges/ChallengeGrid.vue";
import AchievementsGrid from "../../components/challenges/AchievementsGrid.vue";
import LeaderboardTable from "../../components/challenges/LeaderboardTable.vue";
import MyStats from "../../components/challenges/MyStats.vue";
import BottomNav from "../../components/communitys/bottom.vue";
import CurrentlyReading from "../../components/challenges/CurrentlyReading.vue";

import {
  fetchChallenges,
  fetchMyChallenges,
  joinChallenge,
  fetchAchievements,
  fetchMyAchievements,
  fetchMyStats,
  fetchLeaderboard,
  fetchCommunityStats,
  fetchMyReadingProgress,
} from "../../services/community";
import { authState } from "../../services/auth";

export default {
  name: "CommunityPage",
  components: {
    ChallengeHeader,
    ActiveChallenge,
    ChallengeGrid,
    AchievementsGrid,
    LeaderboardTable,
    MyStats,
    BottomNav,
    CurrentlyReading,
  },
  data() {
    return {
      activeNav: "Challenges",
      activeTab: "books",
      loading: true,
      error: null,
      allChallenges: [],
      achievements: [],
      leaderboard: [],
      myStats: { booksRead: 0, currentStreak: 0, totalPages: 0 },
      publicStats: [],
      currentlyReading: null,
      statsData: null,
      leaderboardTabs: [
        { key: "books", label: "Books" },
        { key: "streak", label: "Streak" },
        { key: "pages", label: "Pages" },
      ],
    };
  },
  computed: {
    isAuthenticated() {
      return authState.user.value !== null;
    },
    joinedChallenges() {
      return this.allChallenges.filter((c) => c.joined);
    },
    availableChallenges() {
      return this.allChallenges.filter((c) => !c.joined);
    },
    miniStats() {
      const streak = this.myStats.currentStreak || 0;
      return [
        { val: String(this.myStats.booksRead || 0), label: "Books Read" },
        { val: String(streak), label: "Day Streak", highlight: streak > 0 },
        {
          val: this.formatNumber(this.myStats.totalPages || 0),
          label: "Pages Read",
        },
        {
          val: String(this.achievements.filter((a) => a.earned).length || 0),
          label: "Badges Earned",
        },
      ];
    },
    achievementsPreview() {
      return this.achievements.slice(0, 4);
    },
    myLeaderboardRank() {
      return this.leaderboard.find((r) => r.isYou) || null;
    },
    heroStats() {
      const d = this.statsData;
      if (!d) return [];
      const avg =
        d.activeReaders > 0
          ? Math.round(d.totalBooksRead / d.activeReaders)
          : 0;
      return [
        { val: this.formatNumber(d.activeReaders), label: "Active Readers" },
        { val: this.formatNumber(d.totalChallenges), label: "Live Challenges" },
        { val: this.formatNumber(d.totalBooksRead), label: "Books Tracked" },
        { val: avg, label: "Avg Books/Reader" },
      ];
    },
  },
  created() {
    this.fetchAll();
  },
  methods: {
    statValue(r) {
      return r[this.activeTab] || 0;
    },
    async fetchAll() {
      this.loading = true;
      this.error = null;

      const safeFetch = async (fn, fallback) => {
        try {
          return await fn();
        } catch (e) {
          console.warn("Community fetch failed:", e.message);
          return fallback;
        }
      };

      const [challengesRes, allAchievements, board, statsData] =
        await Promise.all([
          safeFetch(fetchChallenges, []),
          safeFetch(fetchAchievements, []),
          safeFetch(() => fetchLeaderboard("books"), []),
          safeFetch(fetchCommunityStats, null),
        ]);

      this.statsData = statsData;
      if (statsData) {
        this.publicStats = [
          {
            val: this.formatNumber(statsData.totalChallenges),
            label: "Active Challenges",
            delta: "12%",
          },
          {
            val: this.formatNumber(statsData.activeReaders),
            label: "Active Readers",
            delta: "8%",
          },
          {
            val: this.formatNumber(statsData.totalBooksRead),
            label: "Books Read",
            delta: "15%",
          },
        ];
      }

      if (this.isAuthenticated) {
        const [myChallenges, myAchievements, stats, readingProgress] =
          await Promise.all([
            safeFetch(fetchMyChallenges, []),
            safeFetch(fetchMyAchievements, []),
            safeFetch(fetchMyStats, {
              booksRead: 0,
              currentStreak: 0,
              totalPages: 0,
            }),
            safeFetch(fetchMyReadingProgress, []),
          ]);

        const joinedIds = new Set(myChallenges.map((c) => c.id));
        this.allChallenges = challengesRes.map((c) => ({
          ...c,
          joined: joinedIds.has(c.id),
          completedBooks:
            myChallenges.find((mc) => mc.id === c.id)?.completedBooks || 0,
          daysLeft: c.deadline
            ? Math.ceil(
                (new Date(c.deadline).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24),
              )
            : null,
        }));

        this.achievements = myAchievements.map((a) => ({
          ...a,
          date: a.earnedAt
            ? new Date(a.earnedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : null,
        }));

        this.myStats = stats;
        this.currentlyReading = Array.isArray(readingProgress)
          ? readingProgress.slice(0, 3)
          : [];
      } else {
        this.allChallenges = challengesRes.map((c) => ({
          ...c,
          joined: false,
          completedBooks: 0,
          daysLeft: c.deadline
            ? Math.ceil(
                (new Date(c.deadline).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24),
              )
            : null,
        }));

        this.achievements = allAchievements.map((a) => ({
          ...a,
          earned: false,
          date: null,
        }));

        this.myStats = { booksRead: 0, currentStreak: 0, totalPages: 0 };
        this.currentlyReading = [];
      }

      this.leaderboard = this.mapLeaderboard(board);
      this.loading = false;
    },
    async handleJoin(challenge) {
      if (!this.isAuthenticated) {
        window.location.href = "/login?redirect=/community";
        return;
      }
      try {
        await joinChallenge(challenge.id);
        challenge.joined = true;
      } catch (e) {
        this.error = e.message;
      }
    },
    async handleTabChange(tab) {
      this.activeTab = tab;
      this.loading = true;
      try {
        const data = await fetchLeaderboard(tab);
        this.leaderboard = this.mapLeaderboard(data);
      } catch (e) {
        this.error = e.message;
      }
      this.loading = false;
    },
    mapLeaderboard(data) {
      const avatarColors = [
        "#1a3330",
        "#7a3d92",
        "#3a5fa5",
        "#c8861a",
        "#0f6e56",
        "#a04040",
        "#2d6b5e",
      ];
      const currentUserName = authState.user.value?.name || "";
      return data.map((r, i) => ({
        ...r,
        initials: r.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        color: avatarColors[i % avatarColors.length],
        isYou: r.name === currentUserName,
      }));
    },
    formatNumber(n) {
      if (n >= 1000) return (n / 1000).toFixed(1) + "k";
      return String(n);
    },
  },
};
</script>
