<template>
  <div class="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
    <div v-if="loading" class="max-w-7xl mx-auto py-20 text-center text-gray-500">
      Loading trade center...
    </div>

    <div v-else class="max-w-7xl mx-auto space-y-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8B5CF6]"></div>
          <div class="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-[#8B5CF6]">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">My Listings</p>
            <h3 class="text-3xl font-extrabold text-gray-900">{{ myListings.length }}</h3>
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
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Open Requests</p>
            <h3 class="text-3xl font-extrabold text-gray-900">{{ pendingCount }}</h3>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-8 bg-[#B58E2C] rounded-full"></div>
            <h2 class="text-2xl font-bold text-gray-900">My Listings</h2>
          </div>
          <router-link to="/post-exchange" class="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]">
            Post New Book →
          </router-link>
        </div>

        <div v-if="myListings.length === 0" class="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
          You have not posted any books yet.
          <router-link to="/post-exchange" class="mt-3 block font-semibold text-[#8B5CF6] hover:underline">
            Post your first listing
          </router-link>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="book in myListings" :key="book.id" class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <router-link :to="{ name: 'book-exchange-detail-v2', params: { id: book.id } }" class="block">
              <div class="h-64 bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                <img :src="book.imageUrl" :alt="book.title" class="w-full h-full object-cover" />
              </div>
              <p class="text-[10px] font-extrabold text-[#B58E2C] uppercase tracking-wider mb-1">{{ book.listingStatus || 'ACTIVE' }}</p>
              <h4 class="font-bold text-gray-900 text-lg leading-tight line-clamp-1 mb-1">{{ book.title }}</h4>
              <p class="text-sm text-gray-500 mb-4">{{ book.author }}</p>
            </router-link>
            <button
              v-if="book.listingStatus !== 'CLOSED'"
              @click="postToExchange(book)"
              class="mt-auto w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors text-sm"
            >
              Repost / Edit
            </button>
          </div>
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
            <div v-if="incomingRequests.length === 0" class="px-8 py-12 text-center text-gray-500">
              No incoming requests yet.
            </div>
            <table v-else class="w-full text-left border-collapse">
              <thead>
                <tr class="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th class="px-8 py-5">Requested Book</th>
                  <th class="px-6 py-5">Offered Book</th>
                  <th class="px-6 py-5">From Member</th>
                  <th class="px-6 py-5">Date</th>
                  <th class="px-6 py-5">Status</th>
                  <th class="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="req in incomingRequests" :key="req.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-8 py-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img :src="req.exchange?.imageUrl" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-sm">{{ req.exchange?.title }}</p>
                        <p class="text-xs text-gray-500">{{ req.exchange?.author }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img :src="req.offeredExchange?.imageUrl" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-sm">{{ req.offeredExchange?.title }}</p>
                        <p class="text-xs text-gray-500">{{ req.offeredExchange?.author }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-gray-900 text-sm">{{ req.requester?.name || 'Member' }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(req.createdAt) }}</td>
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
                      v-else-if="req.status === 'ACCEPTED' || req.status === 'MEETING_SCHEDULED'"
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
            <div v-if="myProposals.length === 0" class="px-8 py-12 text-center text-gray-500">
              You have not sent any proposals yet.
            </div>
            <table v-else class="w-full text-left border-collapse">
              <thead>
                <tr class="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th class="px-8 py-5">Requested Book</th>
                  <th class="px-6 py-5">Your Offer</th>
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
                        <img :src="proposal.exchange?.imageUrl" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-sm">{{ proposal.exchange?.title }}</p>
                        <p class="text-xs text-gray-500">{{ proposal.exchange?.author }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img :src="proposal.offeredExchange?.imageUrl" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-sm">{{ proposal.offeredExchange?.title }}</p>
                        <p class="text-xs text-gray-500">{{ proposal.offeredExchange?.author }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-gray-900 text-sm">{{ proposal.exchange?.owner?.name || 'Owner' }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(proposal.createdAt) }}</td>
                  <td class="px-6 py-4">
                    <span class="status-pill" :class="getStatusClasses(proposal.status)">
                      <span class="status-dot" :class="getStatusDotClasses(proposal.status)"></span>
                      {{ getStatusLabel(proposal.status) }}
                    </span>
                  </td>
                  <td class="px-8 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <router-link
                        v-if="proposal.status === 'ACCEPTED' || proposal.status === 'MEETING_SCHEDULED'"
                        :to="{ name: 'manage-trade', params: { tradeId: proposal.id } }"
                        class="text-[#8B5CF6] hover:text-[#7C3AED] font-bold text-sm underline-offset-4 hover:underline transition-all"
                      >
                        Manage Pickup →
                      </router-link>
                      <button
                        v-if="proposal.status === 'PENDING' || proposal.status === 'ACCEPTED'"
                        @click="cancelProposal(proposal.id)"
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                      >
                        Cancel Request
                      </button>
                      <span v-if="proposal.status === 'COMPLETED' || proposal.status === 'CANCELLED' || proposal.status === 'REJECTED'" class="text-sm font-semibold text-gray-400">Request closed</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authState } from '../../services/auth';
import { exchangeService } from '../../services/exchange.service';
import type { ExchangeListing, ExchangeRequest, ExchangeRequestStatus } from '../../types/exchange';

const router = useRouter();
const loading = ref(true);
const activeTab = ref<'incoming' | 'proposals'>('incoming');
const incomingRequests = ref<ExchangeRequest[]>([]);
const myProposals = ref<ExchangeRequest[]>([]);
const myListings = ref<ExchangeListing[]>([]);

const tabs = computed(() => [
  { id: 'incoming' as const, name: `Incoming Requests (${incomingRequests.value.length})` },
  { id: 'proposals' as const, name: `My Proposals (${myProposals.value.length})` },
]);

const activeExchangesCount = computed(
  () =>
    [...incomingRequests.value, ...myProposals.value].filter(
      (item) => item.status === 'ACCEPTED' || item.status === 'MEETING_SCHEDULED' || item.status === 'PENDING',
    ).length,
);

const pendingCount = computed(
  () =>
    [...incomingRequests.value, ...myProposals.value].filter((item) => item.status === 'PENDING').length,
);

const formatDate = (value?: string) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusLabel = (status: ExchangeRequestStatus) => {
  const labels: Record<ExchangeRequestStatus, string> = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    MEETING_SCHEDULED: 'Meeting Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    REJECTED: 'Rejected',
  };
  return labels[status];
};

const getStatusClasses = (status: ExchangeRequestStatus) => {
  const classes: Record<ExchangeRequestStatus, string> = {
    PENDING: 'bg-yellow-50 text-yellow-600',
    ACCEPTED: 'bg-blue-50 text-blue-600',
    MEETING_SCHEDULED: 'bg-indigo-50 text-indigo-600',
    COMPLETED: 'bg-green-50 text-green-600',
    CANCELLED: 'bg-red-50 text-red-600',
    REJECTED: 'bg-red-50 text-red-600',
  };
  return classes[status];
};

const getStatusDotClasses = (status: ExchangeRequestStatus) => {
  const classes: Record<ExchangeRequestStatus, string> = {
    PENDING: 'bg-yellow-500',
    ACCEPTED: 'bg-blue-500',
    MEETING_SCHEDULED: 'bg-indigo-500',
    COMPLETED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
    REJECTED: 'bg-red-500',
  };
  return classes[status];
};

const loadDashboard = async () => {
  const [incoming, proposals, listings] = await Promise.all([
    exchangeService.getIncomingRequests(),
    exchangeService.getMyRequests(),
    exchangeService.findMine(),
  ]);
  incomingRequests.value = incoming.data || [];
  myProposals.value = proposals.data || [];
  myListings.value = listings.data || [];
};

const rejectIncomingRequest = async (requestId: string) => {
  await exchangeService.rejectRequest(requestId);
  await loadDashboard();
};

const acceptIncomingRequest = async (requestId: string) => {
  await exchangeService.acceptRequest(requestId);
  await loadDashboard();
};

const cancelProposal = async (proposalId: string) => {
  await exchangeService.cancelRequest(proposalId);
  await loadDashboard();
};

const postToExchange = (book: ExchangeListing) => {
  router.push({
    path: '/exchange-v2/create',
    query: {
      title: book.title,
      author: book.author,
    },
  });
};

onMounted(async () => {
  if (!authState.token.value) {
    router.push({ path: '/login', query: { redirect: '/exchange-dashboard-v2' } });
    return;
  }

  try {
    await loadDashboard();
  } finally {
    loading.value = false;
  }
});
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
