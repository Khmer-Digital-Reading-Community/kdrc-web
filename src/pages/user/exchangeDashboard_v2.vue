<template>
  <div class="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
    <div class="max-w-7xl mx-auto space-y-12">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8B5CF6]"></div>
          <div class="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-[#8B5CF6]">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Books Read</p>
            <h3 class="text-3xl font-extrabold text-gray-900">42</h3>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B58E2C]"></div>
          <div class="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-[#B58E2C]">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Exchanges</p>
            <h3 class="text-3xl font-extrabold text-gray-900">{{ activeExchangesCount }}</h3>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#78350F]"></div>
          <div class="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#78350F]">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Karma Points</p>
            <h3 class="text-3xl font-extrabold text-gray-900">{{ incomingCount + proposalsCount }}</h3>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-8 bg-[#B58E2C] rounded-full"></div>
            <h2 class="text-2xl font-bold text-gray-900">Archived Collection</h2>
          </div>
          <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-900">View All Books →</a>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="book in archivedBooks" :key="book.id" class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <div class="h-64 bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
              <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover" />
            </div>
            <p class="text-[10px] font-extrabold text-[#B58E2C] uppercase tracking-wider mb-1">Read on {{ book.readDate }}</p>
            <h4 class="font-bold text-gray-900 text-lg leading-tight line-clamp-1 mb-1">{{ book.title }}</h4>
            <p class="text-sm text-gray-500 mb-4">{{ book.author }}</p>
            
            <button 
              @click="postToExchange(book)"
              class="mt-auto w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors text-sm"
            >
              Post for Exchange
            </button>
          </div>

          <button class="bg-transparent border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[300px] transition-colors group">
            <div class="w-12 h-12 bg-purple-50 text-[#8B5CF6] group-hover:bg-purple-100 rounded-full flex items-center justify-center mb-4 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            </div>
            <h4 class="font-bold text-gray-900 mb-1">Add New Book</h4>
            <p class="text-xs text-gray-500 text-center px-4">Expand your library by adding your latest reads.</p>
          </button>
        </div>
      </div>

      <div>
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-8 bg-[#8B5CF6] rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900">Exchange Hub</h2>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="flex border-b border-gray-100 px-6 pt-4 gap-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="pb-4 text-sm font-bold transition-colors relative"
              :class="activeTab === tab.id ? 'text-[#8B5CF6]' : 'text-gray-500 hover:text-gray-700'"
            >
              {{ tab.name }}
              <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6] rounded-t-full"></div>
            </button>
          </div>

          <div v-if="activeTab === 'incoming'" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th class="px-8 py-5">Book Title</th>
                  <th class="px-6 py-5">From Member</th>
                  <th class="px-6 py-5">Date Received</th>
                  <th class="px-6 py-5">Status</th>
                  <th class="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="req in incomingRequests" :key="req.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-8 py-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img :src="req.cover" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-sm">{{ req.title }}</p>
                        <p class="text-xs text-gray-500">{{ req.author }}</p>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-gray-900 text-sm">{{ req.member }}</span>
                      <span class="text-[10px] font-bold text-[#B58E2C] bg-yellow-50 px-1.5 py-0.5 rounded">{{ req.rating }}</span>
                    </div>
                  </td>

                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ req.date }}
                  </td>

                  <td class="px-6 py-4">
                    <span class="status-pill" :class="getStatusClasses(req.status)">
                      <span class="status-dot" :class="getStatusDotClasses(req.status)"></span>
                      {{ getStatusLabel(req.status) }}
                    </span>
                  </td>

                  <td class="px-8 py-4 text-right">
                    <div v-if="req.status === 'PENDING'" class="flex items-center justify-end gap-2">
                      <button @click="rejectIncomingRequest(req.id)" class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors" title="Reject request">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <button @click="acceptIncomingRequest(req.id)" class="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white hover:bg-[#7C3AED] transition-colors shadow-sm" title="Accept request">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                      </button>
                    </div>
                    <router-link
                      v-else-if="req.status === 'ACCEPTED'"
                      :to="{ name: 'manage-trade', params: { tradeId: req.id } }"
                      class="text-[#8B5CF6] hover:text-[#7C3AED] font-bold text-sm underline-offset-4 hover:underline transition-all"
                    >
                      Manage Pickup
                    </router-link>
                    <span v-else class="text-sm font-semibold text-gray-400">No action needed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th class="px-8 py-5">Requested Book</th>
                  <th class="px-6 py-5">Owner</th>
                  <th class="px-6 py-5">Submitted</th>
                  <th class="px-6 py-5">Status</th>
                  <th class="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="proposal in myProposals" :key="proposal.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-8 py-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img :src="proposal.cover" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-sm">{{ proposal.title }}</p>
                        <p class="text-xs text-gray-500">{{ proposal.author }}</p>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4">
                    <span class="font-bold text-gray-900 text-sm">{{ proposal.member }}</span>
                  </td>

                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ proposal.date }}
                  </td>

                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span v-if="proposal.status === 'PENDING'" class="px-2 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600">Pending</span>
                      <span v-else-if="proposal.status === 'ACCEPTED'" class="px-2 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">Accepted</span>
                      <span v-else-if="proposal.status === 'COMPLETED'" class="px-2 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">Completed</span>
                      <span v-else-if="proposal.status === 'CANCELLED'" class="px-2 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">Cancelled</span>
                    </div>
                  </td>

                  <td class="px-8 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        v-if="proposal.status === 'PENDING'"
                        @click="cancelProposal(proposal.id)"
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                      >
                        Cancel Request
                      </button>

                      <router-link
                        v-else-if="proposal.status === 'ACCEPTED'"
                        :to="{ name: 'manage-trade', params: { tradeId: proposal.id } }"
                        class="text-[#8B5CF6] hover:text-[#7C3AED] font-bold text-sm underline-offset-4 hover:underline transition-all"
                      >
                        Manage Pickup →
                      </router-link>

                      <span v-else class="text-sm font-semibold text-gray-400">Request closed</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-8 py-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
            <span>{{ activeTab === 'incoming' ? `Showing ${incomingRequests.length} incoming requests` : `Showing ${myProposals.length} proposals` }}</span>
            <div class="flex gap-4 font-bold">
              <button class="text-gray-300 cursor-not-allowed">Previous</button>
              <button class="text-[#093A3F] hover:text-[#0d4d54]">Next</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

type TradeStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

type ExchangeItem = {
  id: number;
  title: string;
  author: string;
  cover: string;
  date: string;
  status: TradeStatus;
  member?: string;
  rating?: string;
};

// Tabs State
const activeTab = ref<'incoming' | 'proposals'>('incoming');
const tabs: Array<{ id: 'incoming' | 'proposals'; name: string }> = [
  { id: 'incoming', name: 'Incoming Requests (3)' },
  { id: 'proposals', name: 'My Proposals (2)' },
];

const incomingRequests = ref<ExchangeItem[]>([
  {
    id: 101,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg',
    member: 'Sophea K.',
    rating: '4.9',
    date: '2 hours ago',
    status: 'PENDING',
  },
  {
    id: 102,
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg',
    member: 'David Miller',
    rating: '5.0',
    date: 'Yesterday',
    status: 'ACCEPTED',
  },
  {
    id: 103,
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    cover: 'https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg',
    member: 'Borey Van',
    rating: '4.7',
    date: '3 days ago',
    status: 'COMPLETED',
  },
]);

const myProposals = ref<ExchangeItem[]>([
  {
    id: 201,
    title: 'Meditations',
    author: 'Marcus Aurelius',
    cover: 'https://covers.openlibrary.org/b/isbn/9780812968255-M.jpg',
    member: 'Sokha R.',
    date: 'Today',
    status: 'PENDING',
  },
  {
    id: 202,
    title: 'Deep Work',
    author: 'Cal Newport',
    cover: 'https://covers.openlibrary.org/b/isbn/9781455586691-M.jpg',
    member: 'Maly S.',
    date: '2 days ago',
    status: 'ACCEPTED',
  },
  {
    id: 203,
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    cover: 'https://covers.openlibrary.org/b/isbn/9781544514222-M.jpg',
    member: 'Srey Pov',
    date: 'Last week',
    status: 'CANCELLED',
  },
]);

const getStatusLabel = (status: TradeStatus) => {
  const labels: Record<TradeStatus, string> = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  return labels[status];
};

const getStatusClasses = (status: TradeStatus) => {
  const classes: Record<TradeStatus, string> = {
    PENDING: 'bg-yellow-50 text-yellow-600',
    ACCEPTED: 'bg-blue-50 text-blue-600',
    COMPLETED: 'bg-green-50 text-green-600',
    CANCELLED: 'bg-red-50 text-red-600',
  };

  return classes[status];
};

const getStatusDotClasses = (status: TradeStatus) => {
  const classes: Record<TradeStatus, string> = {
    PENDING: 'bg-yellow-500',
    ACCEPTED: 'bg-blue-500',
    COMPLETED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
  };

  return classes[status];
};

const rejectIncomingRequest = (requestId: number) => {
  incomingRequests.value = incomingRequests.value.map((request) =>
    request.id === requestId ? { ...request, status: 'CANCELLED' } : request,
  );
};

const acceptIncomingRequest = (requestId: number) => {
  incomingRequests.value = incomingRequests.value.map((request) =>
    request.id === requestId ? { ...request, status: 'ACCEPTED' } : request,
  );
};

const cancelProposal = (proposalId: number) => {
  myProposals.value = myProposals.value.map((proposal) =>
    proposal.id === proposalId ? { ...proposal, status: 'CANCELLED' } : proposal,
  );
};

const incomingCount = computed(() => incomingRequests.value.length);
const proposalsCount = computed(() => myProposals.value.length);
const activeExchangesCount = computed(
  () =>
    [...incomingRequests.value, ...myProposals.value].filter(
      (item) => item.status === 'ACCEPTED' || item.status === 'PENDING',
    ).length,
);

// Mock Data: Archived Books (Personal Library)
const archivedBooks = ref([
  {
    id: 1,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    readDate: 'DEC 12, 2023',
    cover: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg'
  },
  {
    id: 2,
    title: 'Circe',
    author: 'Madeline Miller',
    readDate: 'NOV 28, 2023',
    cover: 'https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg'
  },
  {
    id: 3,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    readDate: 'OCT 15, 2023',
    cover: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg'
  }
]);

// 🚨 Smart Routing: This passes the exact book info to your ExchangeForm!
const postToExchange = (book: any) => {
  router.push({
    path: '/exchange-v2/create',
    query: {
      title: book.title,
      author: book.author
    }
  });
};
</script>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
}
</style>