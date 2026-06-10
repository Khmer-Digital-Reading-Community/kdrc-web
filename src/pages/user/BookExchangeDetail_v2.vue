<template>
  <div class="min-h-screen bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
    
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#093A3F]"></div>
    </div>

    <div v-else-if="error" class="max-w-3xl mx-auto text-center py-20">
      <h2 class="text-2xl font-bold mb-2">Book not found</h2>
      <p class="text-gray-500 mb-6">The exchange listing you're looking for doesn't exist.</p>
      <button @click="router.push('/exchange-v2')" class="bg-[#093A3F] text-white px-6 py-2 rounded-xl">Go Back</button>
    </div>

    <div v-else-if="book" class="max-w-7xl mx-auto">
      
      <nav class="flex text-sm text-gray-500 font-medium mb-6">
        <ol class="flex items-center space-x-2">
          <li><a href="#" class="hover:text-gray-900">Marketplace</a></li>
          <li><span>›</span></li>
          <li><router-link to="/exchange-v2" class="hover:text-gray-900">Exchanges</router-link></li>
          <li><span>›</span></li>
          <li class="text-gray-900">{{ book.title }}</li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-8">
          
          <div class="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div class="w-full md:w-1/3 flex-shrink-0">
              <img 
                :src="book.imageUrl" 
                :alt="book.title" 
                class="w-full h-auto rounded-xl shadow-md object-cover"
                @error="onImgError"
              />
            </div>
            
            <div class="w-full md:w-2/3 flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                  {{ book.condition.replace('_', ' ') }}
                </span>
                <span class="flex items-center text-gray-500 text-sm font-medium">
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {{ book.location }}
                </span>
              </div>

              <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
                {{ book.title }}
              </h1>
              <p class="text-xl text-[#6D28D9] font-medium mb-6">by {{ book.author }}</p>

              <div class="flex flex-wrap gap-2 mb-8">
                <span class="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-lg">NON-FICTION</span>
                <span class="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-lg">ENGLISH</span>
                <span class="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-lg">POSTED RECENTLY</span>
              </div>

              <blockquote class="border-l-4 border-yellow-400 pl-5 text-gray-600 italic text-lg leading-relaxed">
                "{{ book.description }}"
              </blockquote>
            </div>
          </div>

          <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-orange-50 p-2 rounded-full">
                <svg class="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              </div>
              <h2 class="text-xl font-bold">Exchange Terms</h2>
            </div>
            <p class="text-gray-600 mb-6 leading-relaxed">
              I am looking to trade this beautiful copy for books in the following areas. I'm specifically looking for editions in similar condition.
              <br><br>
              <strong>Looking for:</strong> {{ book.tradingFor }}
            </p>
            <div class="flex flex-wrap gap-3">
              <span class="px-4 py-2 bg-purple-50 text-purple-700 text-sm font-semibold rounded-xl border border-purple-100">Philosophy</span>
              <span class="px-4 py-2 bg-purple-50 text-purple-700 text-sm font-semibold rounded-xl border border-purple-100">Tech Books</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div>
              <div class="flex items-center gap-2 mb-6">
                <div class="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
                <h3 class="text-lg font-bold">Specifications</h3>
              </div>
              <ul class="space-y-4 text-sm">
                <li class="flex justify-between border-b border-gray-50 pb-2">
                  <span class="text-gray-500">Format</span>
                  <span class="font-medium">Paperback</span>
                </li>
                <li class="flex justify-between border-b border-gray-50 pb-2">
                  <span class="text-gray-500">Pages</span>
                  <span class="font-medium">Unknown</span>
                </li>
                <li class="flex justify-between border-b border-gray-50 pb-2">
                  <span class="text-gray-500">Language</span>
                  <span class="font-medium">English</span>
                </li>
                <li class="flex justify-between pb-2">
                  <span class="text-gray-500">ISBN</span>
                  <span class="font-medium">N/A</span>
                </li>
              </ul>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-6">
                <div class="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
                <h3 class="text-lg font-bold">Quality Check</h3>
              </div>
              <ul class="space-y-4 text-sm font-medium text-gray-700">
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-[#093A3F]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                  No highlights or annotations
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-[#093A3F]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                  Binding tight and intact
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-[#093A3F]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                  Minimal shelf wear
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
          
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div class="relative mb-4">
              <img :src="ownerAvatar" alt="Avatar" class="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
              <div class="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 mb-1">{{ ownerName }}</h3>
            <span class="px-3 py-1 bg-purple-100 text-[#6D28D9] text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-6">
              ACTIVE EXCHANGER
            </span>

            <p v-if="book.contactNumber" class="text-sm text-gray-600 mb-4 font-medium">
              Contact: {{ book.contactNumber }}
            </p>

            <p class="text-sm text-gray-500 italic">
              {{ ownerBio }}
            </p>
          </div>

          <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-900">Location</h3>
              <a href="#" class="text-[#6D28D9] text-sm font-semibold hover:underline">View on map</a>
            </div>
            <div class="w-full h-32 bg-gray-200 rounded-xl mb-4 relative overflow-hidden flex justify-center items-center">
              <div class="absolute inset-0 bg-blue-100/50"></div>
              <svg class="w-8 h-8 text-[#6D28D9] relative z-10 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
            </div>
            <p class="text-sm text-gray-500 font-medium">{{ book.location }}</p>
          </div>

        </div>
      </div>

      <div class="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p class="text-xs text-gray-500 font-bold tracking-wider uppercase mb-1">EXCHANGE STATUS</p>
          <p class="text-lg font-bold text-gray-900">{{ listingStatusLabel }}</p>
        </div>
        <div class="flex gap-4 w-full md:w-auto">
          <button class="flex-1 md:flex-none bg-purple-50 text-[#6D28D9] hover:bg-purple-100 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            Message
          </button>
          <button
            type="button"
            @click="openProposalModal"
            class="flex-1 md:flex-none bg-[#093A3F] hover:bg-[#0d4d54] text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-60"
            :disabled="hasPendingRequest || isOwnListing || book?.listingStatus === 'CLOSED'"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            {{ proposeButtonLabel }}
          </button>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div class="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Propose Exchange</h3>
                <p class="text-sm text-gray-500">Choose one of your books and add a message to the owner.</p>
              </div>
              <button type="button" @click="closeModal" class="text-gray-400 hover:text-gray-700 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div class="px-6 py-6 space-y-6">
              <div>
                <h4 class="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Select a book to offer</h4>
                <div v-if="offeredBooks.length === 0" class="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  You need an active listing to propose a trade.
                  <router-link to="/post-exchange" class="mt-2 block font-semibold text-[#8B5CF6] hover:underline">
                    Post a book first
                  </router-link>
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    v-for="offer in offeredBooks"
                    :key="offer.id"
                    class="flex items-start gap-3 rounded-2xl border px-4 py-4 cursor-pointer transition-all"
                    :class="selectedOffer === offer.id ? 'border-[#8B5CF6] bg-purple-50' : 'border-gray-200 hover:border-gray-300'"
                  >
                    <input v-model="selectedOffer" type="radio" :value="offer.id" class="mt-1 text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                    <div>
                      <p class="font-semibold text-gray-900">{{ offer.title }}</p>
                      <p class="text-sm text-gray-500">{{ offer.author }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message to Owner (Optional)</label>
                <textarea
                  v-model="customMessage"
                  rows="4"
                  class="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                  placeholder="Write a short note about your offer..."
                ></textarea>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50">
              <button type="button" @click="closeModal" class="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button
                type="button"
                @click="submitProposal"
                :disabled="isSubmitting || !selectedOffer"
                class="px-6 py-2.5 rounded-xl bg-[#093A3F] text-white font-semibold hover:bg-[#0d4d54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Proposal' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="toast.show" class="fixed top-5 right-5 px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 text-white font-medium" :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'">
          <svg v-if="toast.type === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ toast.message }}
        </div>
      </Transition>

      <div class="mt-16 pt-10 border-t border-gray-200">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">You might also like</h2>
          <router-link to="/exchange-v2" class="text-[#093A3F] font-bold text-sm hover:underline flex items-center gap-1">
            View more 
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </router-link>
        </div>
        
        <div v-if="relatedListings.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <router-link
            v-for="item in relatedListings"
            :key="item.id"
            :to="{ name: 'book-exchange-detail-v2', params: { id: item.id } }"
            class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div class="bg-gray-100 h-48 rounded-xl mb-4 w-full flex items-center justify-center overflow-hidden">
              <img :src="item.imageUrl" :alt="item.title" class="h-full w-full object-cover" />
            </div>
            <span class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase mb-2 inline-block">{{ item.condition.replace('_', ' ') }}</span>
            <h4 class="font-bold text-gray-900 text-sm line-clamp-1">{{ item.title }}</h4>
            <p class="text-xs text-gray-500 mt-1">{{ item.location }}</p>
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authState } from '../../services/auth';
import { exchangeService } from '../../services/exchange.service';
import type { ExchangeListing } from '../../types/exchange';

const route = useRoute();
const router = useRouter();

const book = ref<ExchangeListing | null>(null);
const relatedListings = ref<ExchangeListing[]>([]);
const offeredBooks = ref<ExchangeListing[]>([]);
const loading = ref(true);
const error = ref(false);
const showModal = ref(false);
const isSubmitting = ref(false);
const selectedOffer = ref<string | null>(null);
const customMessage = ref('');
const hasPendingRequest = ref(false);

const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
});

const ownerName = computed(() => book.value?.owner?.name || 'Community Member');
const ownerAvatar = computed(() =>
  book.value?.owner?.avatarUrl ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName.value)}&background=random`,
);
const ownerBio = computed(
  () => book.value?.owner?.bio || 'Passionate reader looking to swap great books with the community.',
);
const isOwnListing = computed(
  () => Boolean(book.value?.owner?.id && authState.user.value?.id === book.value.owner.id),
);
const listingStatusLabel = computed(() =>
  book.value?.listingStatus === 'CLOSED' ? 'No longer available' : 'Available for trade',
);
const proposeButtonLabel = computed(() => {
  if (isOwnListing.value) return 'Your Listing';
  if (book.value?.listingStatus === 'CLOSED') return 'Closed';
  if (hasPendingRequest.value) return 'Request Pending';
  return 'Propose Exchange';
});

const showToast = (msg: string, type: 'success' | 'error') => {
  toast.message = msg;
  toast.type = type;
  toast.show = true;
  setTimeout(() => { toast.show = false; }, 3000);
};

const closeModal = () => {
  showModal.value = false;
};

const openProposalModal = () => {
  if (!authState.token.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }
  if (hasPendingRequest.value) {
    showToast('You already have a pending request for this book.', 'error');
    return;
  }
  if (isOwnListing.value) {
    showToast('You cannot request your own listing.', 'error');
    return;
  }
  showModal.value = true;
};

const submitProposal = async () => {
  if (!book.value || !selectedOffer.value) return;

  isSubmitting.value = true;
  try {
    await exchangeService.createRequest({
      exchangeId: book.value.id,
      offeredExchangeId: selectedOffer.value,
      message: customMessage.value.trim() || undefined,
    });
    closeModal();
    showToast('Proposal sent successfully!', 'success');
    hasPendingRequest.value = true;
    selectedOffer.value = null;
    customMessage.value = '';
  } catch (err: any) {
    const message = err?.response?.data?.message || 'Failed to send proposal.';
    showToast(Array.isArray(message) ? message[0] : message, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const onImgError = (e: Event) => {
  const t = e.target as HTMLImageElement | null;
  if (t) t.src = 'https://via.placeholder.com/300x450?text=No+Cover';
};

const loadOfferedBooks = async () => {
  if (!authState.token.value) return;
  try {
    const response = await exchangeService.findMine();
    offeredBooks.value = (response.data || []).filter(
      (listing) => listing.listingStatus !== 'CLOSED' && listing.id !== book.value?.id,
    );
  } catch {
    offeredBooks.value = [];
  }
};

const loadRelatedListings = async () => {
  if (!book.value) return;
  try {
    const response = await exchangeService.search({
      location: book.value.location,
      limit: 6,
    });
    relatedListings.value = (response.data?.data || []).filter((item) => item.id !== book.value?.id).slice(0, 5);
  } catch {
    relatedListings.value = [];
  }
};

onMounted(async () => {
  const bookId = route.params.id as string;
  try {
    const response = await exchangeService.findOne(bookId);
    book.value = response.data;
    await Promise.all([
      loadOfferedBooks(),
      loadRelatedListings(),
      authState.token.value
        ? exchangeService.hasPendingRequest(bookId).then((res) => {
            hasPendingRequest.value = res.data.hasPending;
          })
        : Promise.resolve(),
    ]);
  } catch (err) {
    console.error('Failed to load book:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>