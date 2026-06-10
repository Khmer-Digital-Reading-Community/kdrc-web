<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
    
    <Transition name="fade">
      <div v-if="toast.show" 
           :class="[
             'fixed top-5 right-5 px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 text-white font-medium',
             toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
           ]">
        <svg v-if="toast.type === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {{ toast.message }}
      </div>
    </Transition>

    <div class="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      
      <div class="bg-[#093A3F] px-8 py-6">
        <h2 class="text-2xl font-bold text-[#FDE9D0]!">Post a Book for Exchange</h2>
        <p class="text-[#FDE9D0]/70 text-sm mt-1">Fill out the details below to add your book to the community.</p>
      </div>

      <form @submit.prevent="submitForm" class="px-8 py-8 space-y-6">
        
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-2">Book Cover Image *</label>
          
          <div class="relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-colors"
               :class="imagePreview ? 'border-[#8B5CF6] bg-purple-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'">
            
            <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-contain p-2" />
            
            <div v-else class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p class="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
            </div>
            
            <input type="file" required accept="image/*" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Book Title *</label>
            <input v-model="form.title" type="text" required placeholder="e.g., Atomic Habits" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B5CF6] outline-none transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Exchange Type *</label>
            <select v-model="form.exchangeType" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B5CF6] outline-none transition-all bg-white">
              <option value="SWAP">Swap (Trade for another book)</option>
              <option value="SELL">Sell (For cash)</option>
              <option value="GIVEAWAY">Giveaway (Free)</option>
            </select>
          </div>
        </div>

        <div v-if="form.exchangeType === 'SELL'" class="bg-green-50 p-4 rounded-xl border border-green-100">
          <label class="block text-sm font-medium text-green-800 mb-2">Price ($) *</label>
          <input v-model="form.price" type="number" step="0.01" min="0" :required="form.exchangeType === 'SELL'" placeholder="e.g., 5.00" class="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
            <select v-model="form.condition" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B5CF6] outline-none transition-all bg-white">
              <option value="" disabled>Select condition...</option>
              <option value="NEW">New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="GOOD">Good</option>
              <option value="ACCEPTABLE">Acceptable</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <select v-model="form.location" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B5CF6] outline-none transition-all bg-white">
              <option value="" disabled>Select your city...</option>
              <option value="Phnom Penh">Phnom Penh</option>
              <option value="Banteay Meanchey">Banteay Meanchey</option>
              <option value="Battambang">Battambang</option>
              <option value="Kampong Cham">Kampong Cham</option>
              <option value="Kampong Chhnang">Kampong Chhnang</option>
              <option value="Kampong Speu">Kampong Speu</option>
              <option value="Kampong Thom">Kampong Thom</option>
              <option value="Kampot">Kampot</option>
              <option value="Kandal">Kandal</option>
              <option value="Kep">Kep</option>
              <option value="Koh Kong">Koh Kong</option>
              <option value="Kratie">Kratie</option>
              <option value="Mondulkiri">Mondulkiri</option>
              <option value="Oddar Meanchey">Oddar Meanchey</option>
              <option value="Pailin">Pailin</option>
              <option value="Preah Sihanouk">Preah Sihanouk</option>
              <option value="Preah Vihear">Preah Vihear</option>
              <option value="Pursat">Pursat</option>
              <option value="Ratanakiri">Ratanakiri</option>
              <option value="Siem Reap">Siem Reap</option>
              <option value="Stung Treng">Stung Treng</option>
              <option value="Svay Rieng">Svay Rieng</option>
              <option value="Takeo">Takeo</option>
              <option value="Tboung Khmum">Tboung Khmum</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Author *</label>
            <input v-model="form.author" type="text" required placeholder="e.g., F. Scott Fitzgerald" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B5CF6] outline-none transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Looking For (Trading For) *</label>
            <input v-model="form.tradingFor" type="text" required placeholder="e.g., To Kill a Mockingbird" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B5CF6] outline-none transition-all" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Contact Number / Telegram (Optional)</label>
          <input v-model="form.contactNumber" type="text" placeholder="e.g., +855 12 345 678 or @username" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B5CF6] outline-none transition-all" />
          <p class="text-xs text-gray-400 mt-1">Buyers/Traders will use this or the direct chat to reach you.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea v-model="form.description" required rows="4" placeholder="Share details about the edition, what books you want in return, or specific damage..." class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B5CF6] outline-none transition-all resize-none"></textarea>
        </div>

        <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <button type="button" @click="router.push('/exchange-v2')" class="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          
          <button type="submit" :disabled="isSubmitting" class="bg-[#093A3F] hover:bg-[#0d4d54] text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Uploading Book...' : 'Post Exchange' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { exchangeService } from '../../services/exchange.service';
import { authState } from '../../services/auth';

const router = useRouter();
const route = useRoute();

// State
const isSubmitting = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

// Toast Notification State
const toast = reactive({
  show: false,
  message: '',
  type: 'success' // 'success' or 'error'
});

// Form Data
type ExchangeForm = {
  title: string;
  author: string;
  description: string;
  tradingFor: string;
  condition: string;
  location: string;
  exchangeType: string;
  price: number | null;
  contactNumber: string;
};

const form = reactive<ExchangeForm>({
  title: '',
  author: '',
  description: '',
  tradingFor: '',
  condition: '',
  location: '',
  exchangeType: 'SWAP',
  price: null,
  contactNumber: '',
});

onMounted(() => {
  if (!authState.token.value) {
    router.push({
      path: '/login',
      query: { redirect: route.fullPath },
    });
    return;
  }

  const title = route.query.title;
  const author = route.query.author;

  if (typeof title === 'string' && title.trim()) {
    form.title = title;
  }

  if (typeof author === 'string' && author.trim()) {
    form.author = author;
  }
});

// Handle File Selection & Generate Preview
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    
    // Basic frontend validation (File size limit: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      target.value = ''; // Reset input
      return;
    }

    imageFile.value = file;
    // Creates a temporary local URL so the user can see the image instantly
    imagePreview.value = URL.createObjectURL(file);
  }
};

const showToast = (msg: string, type: 'success' | 'error') => {
  toast.message = msg;
  toast.type = type;
  toast.show = true;
  // Auto-hide toast after 3 seconds
  setTimeout(() => { toast.show = false; }, 3000);
};

// Form Submission
const submitForm = async () => {
  if (!imageFile.value) {
    showToast('Please upload a book cover image.', 'error');
    return;
  }

  isSubmitting.value = true;
  
  try {
    // Because we are uploading an actual file now, we must use FormData 
    // instead of a standard JSON object.
    const formData = new FormData();
    formData.append('image', imageFile.value);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('condition', form.condition);
    formData.append('location', form.location);
    formData.append('exchangeType', form.exchangeType);
    formData.append('author', form.author);
    formData.append('tradingFor', form.tradingFor);

    if (form.contactNumber.trim()) {
      formData.append('contactNumber', form.contactNumber.trim());
    }

    if (form.exchangeType === 'SELL' && form.price) {
      formData.append('price', form.price.toString());
    }

    // Call your service (ensure exchangeService supports FormData!)
    await exchangeService.create(formData);
    
    // Show Success Toast
    showToast('Book posted successfully!', 'success');
    
    // Wait 1.5 seconds so they can see the success message before redirecting
    setTimeout(() => {
      router.push('/exchange-v2');
    }, 1500);

  } catch (error) {
    console.error('Failed to create exchange post:', error);
    showToast('Failed to post book. Please check your connection.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Smooth fade transition for the toast notification */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
