<template>
  <div class="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Trade in Progress</h1>
          <p class="text-sm text-gray-500">Trading with David Miller</p>
        </div>
        <div class="text-sm text-gray-600 flex items-center gap-3">
          <span class="text-xs font-semibold text-gray-400">Live Sync</span>
          <button class="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">On</button>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="rounded-full w-10 h-10 bg-green-50 flex items-center justify-center text-green-600 font-bold">✓</div>
          <div>
            <div class="text-sm font-bold">Requested</div>
            <div class="text-xs text-gray-400">You requested the trade</div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="rounded-full w-10 h-10 bg-blue-50 flex items-center justify-center text-blue-600 font-bold">✓</div>
          <div>
            <div class="text-sm font-bold">Accepted</div>
            <div class="text-xs text-gray-400">Owner accepted your proposal</div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="rounded-full w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-600 font-bold">3</div>
          <div>
            <div class="text-sm font-bold">Completed</div>
            <div class="text-xs text-gray-400">Final step: confirm the swap</div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-bold">Time to swap books!</h3>
          <p class="text-sm text-gray-600">Contact David using the chat below to arrange a meeting place. Once you have successfully swapped the books, click the button below to close this trade.</p>
        </div>

        <div class="flex items-center justify-end">
          <button @click="markAsCompleted" class="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700">Mark as Completed</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const refreshInterval = ref<number | null>(null);
const completed = ref(false);

onMounted(() => {
  refreshInterval.value = window.setInterval(() => {
    console.log('Checking for trade status updates for id:', route.params.id);
    // TODO: call API: apiClient.get(`/exchanges/status/${route.params.id}`)
  }, 10000);
});

onUnmounted(() => {
  if (refreshInterval.value) clearInterval(refreshInterval.value);
});

const markAsCompleted = () => {
  completed.value = true;
  console.log('Trade marked as completed');
  // TODO: call API to mark trade complete
};
</script>

<style scoped>
</style>
