<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePurchases } from "../../composables/usePurchases";
import { token } from "../../services/auth";
import { useRouter } from "vue-router";

const props = defineProps<{
  bookId: string;
  price: number;
  isPurchasable: boolean;
  isFree: boolean;
  itemType?: "BOOK" | "CHAPTER";
  itemId?: string;
  itemName?: string;
}>();

const emit = defineEmits<{
  purchased: [];
  purchase: [{ itemType: string; itemId: string; itemName: string; amount: number }];
}>();

const router = useRouter();
const { credits, loading, purchaseBook, checkOwnership } =
  usePurchases();

const owned = ref(false);
const checking = ref(true);
const purchaseError = ref("");

onMounted(async () => {
  if (props.isFree) {
    owned.value = true;
    checking.value = false;
    return;
  }
  if (!token.value) {
    checking.value = false;
    return;
  }
  owned.value = await checkOwnership(props.bookId);
  checking.value = false;
});

const handleQrPay = () => {
  if (!token.value) {
    router.push("/login");
    return;
  }
  emit("purchase", {
    itemType: props.itemType ?? "BOOK",
    itemId: props.itemId ?? props.bookId,
    itemName: props.itemName ?? "",
    amount: props.price,
  });
};

const handleBuy = async () => {
  if (!token.value) {
    router.push("/login");
    return;
  }
  purchaseError.value = "";
  const result = await purchaseBook(props.bookId, props.price);
  if (result.success) {
    owned.value = true;
    emit("purchased");
  } else if (result.error) {
    purchaseError.value = result.error;
  }
};
</script>

<template>
  <div v-if="!checking" class="flex items-center gap-3">
    <!-- Free badge -->
    <span
      v-if="isFree"
      class="px-4 py-2 text-sm font-semibold rounded-xl bg-green-100 text-green-700 border border-green-300"
    >
      Free
    </span>

    <!-- Owned -->
    <span
      v-else-if="owned"
      class="px-4 py-2 text-sm font-semibold rounded-xl bg-[#093A3F] text-white border border-[#093A3F]"
    >
      Owned
    </span>

    <!-- Buy -->
    <template v-else-if="isPurchasable && price > 0">
      <button
        @click="handleBuy"
        :disabled="loading"
        class="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 border bg-[#c5a050] text-white border-[#c5a050] hover:bg-[#b8913f] disabled:opacity-50"
      >
        <span v-if="loading">Buying...</span>
        <span v-else>Buy — {{ price }} credits</span>
      </button>
      <button
        @click="handleQrPay"
        class="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 border border-[#093A3F] text-[#093A3F] hover:bg-[#093A3F] hover:text-white"
      >
        <svg class="w-4 h-4 inline-block -mt-px mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Pay with QR
      </button>
      <span v-if="token" class="text-xs text-gray-500">
        Balance: {{ credits }} credits
      </span>
    </template>

    <p v-if="purchaseError" class="text-sm text-red-600">{{ purchaseError }}</p>
  </div>
</template>
