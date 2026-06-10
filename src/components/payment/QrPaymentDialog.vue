<template>
  <Teleport to="body">
    <div
      v-if="show && ps.phase.value !== 'idle'"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click.self="handleBackdrop"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-100">
          <h2 class="text-lg font-bold text-[#123C3A]">
            {{ itemName }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ itemType === 'BOOK' ? 'Purchase Book' : 'Purchase Chapter' }}
          </p>
        </div>

        <!-- Body -->
        <div class="px-6 py-6 flex flex-col items-center">
          <!-- Initiating -->
          <template v-if="ps.phase.value === 'initiating'">
            <div class="w-10 h-10 border-2 border-[#c5a050] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p class="text-sm text-gray-600">Creating payment...</p>
          </template>

          <!-- Ready / Polling: QR display -->
          <template v-else-if="ps.phase.value === 'ready' || ps.phase.value === 'polling'">
            <div class="bg-gray-50 rounded-xl p-4 mb-4">
              <img
                v-if="ps.qrDataUrl.value"
                :src="ps.qrDataUrl.value"
                alt="Payment QR Code"
                class="w-56 h-56 mx-auto"
              />
              <div v-else class="w-56 h-56 mx-auto flex items-center justify-center">
                <div class="w-8 h-8 border-2 border-[#c5a050] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>

            <p class="text-xl font-bold text-[#123C3A]">
              ${{ amount.toFixed(2) }}
            </p>

            <div class="flex items-center gap-1.5 mt-2 text-sm" :class="ps.countdown.value <= 60 ? 'text-red-500' : 'text-gray-500'">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path stroke-linecap="round" d="M12 6v6l4 2" />
              </svg>
              <span>{{ ps.timeRemaining.value }}</span>
            </div>

            <p class="text-xs text-gray-400 mt-3 text-center">
              Scan the QR code with your payment app to complete the purchase.
            </p>

            <!-- Dev: manual confirm -->
            <button
              @click="ps.confirmManually()"
              class="mt-4 px-4 py-2 text-xs font-medium rounded-lg border border-dashed border-[#c5a050] text-[#c5a050] hover:bg-[#c5a050]/10 transition"
            >
              Dev: Confirm Payment
            </button>
          </template>

          <!-- Success -->
          <template v-else-if="ps.phase.value === 'success'">
            <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-lg font-bold text-green-700">Payment Successful!</p>
            <p class="text-sm text-gray-500 mt-1">You now have access to this content.</p>
            <button
              @click="handleSuccess"
              class="mt-6 w-full py-2.5 rounded-xl bg-[#093A3F] text-white text-sm font-semibold hover:bg-[#0a4a50] transition"
            >
              Continue Reading
            </button>
          </template>

          <!-- Expired -->
          <template v-else-if="ps.phase.value === 'expired'">
            <div class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path stroke-linecap="round" d="M12 8v4l2 2" />
              </svg>
            </div>
            <p class="text-lg font-bold text-amber-700">Session Expired</p>
            <p class="text-sm text-gray-500 mt-1 text-center">The payment window has closed. Please try again.</p>
            <button
              @click="retry"
              class="mt-6 w-full py-2.5 rounded-xl bg-[#c5a050] text-white text-sm font-semibold hover:bg-[#b09040] transition"
            >
              Try Again
            </button>
          </template>

          <!-- Failed -->
          <template v-else-if="ps.phase.value === 'failed'">
            <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p class="text-lg font-bold text-red-700">Payment Failed</p>
            <p class="text-sm text-gray-500 mt-1 text-center">
              {{ ps.error.value || "Something went wrong." }}
            </p>
            <button
              @click="retry"
              class="mt-6 w-full py-2.5 rounded-xl bg-[#c5a050] text-white text-sm font-semibold hover:bg-[#b09040] transition"
            >
              Try Again
            </button>
          </template>
        </div>

        <!-- Footer (only for ready/polling states) -->
        <div
          v-if="ps.phase.value === 'ready' || ps.phase.value === 'polling'"
          class="px-6 py-4 border-t border-gray-100"
        >
          <button
            @click="handleCancel"
            class="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { usePaymentSession } from "../../composables/usePaymentSession";

const props = defineProps<{
  show: boolean;
  itemType: "BOOK" | "CHAPTER";
  itemId: string;
  itemName: string;
  amount: number;
}>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const ps = usePaymentSession();

watch(
  () => props.show,
  (open) => {
    if (open) {
      ps.initiatePayment(props.itemType, props.itemId);
    } else {
      ps.reset();
    }
  },
);

function handleBackdrop() {
  if (ps.phase.value === "ready" || ps.phase.value === "polling") {
    emit("close");
  }
}

function handleSuccess() {
  emit("success");
  emit("close");
}

function handleCancel() {
  ps.cancel();
  emit("close");
}

function retry() {
  ps.reset();
  ps.initiatePayment(props.itemType, props.itemId);
}
</script>
