<template>
  <div class="bg-[#FBF7F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
    <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between sm:items-start gap-3">
      <div>
        <h3 class="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.15em] text-gray-700 mb-2">
          Recent Transactions
        </h3>
        <p class="text-[11px] sm:text-[12px] text-gray-500">Latest earnings activity</p>
      </div>
      <button class="text-[11px] sm:text-[12px] font-bold text-[#c1712a] hover:text-[#a15c20] transition whitespace-nowrap">
        View all →
      </button>
    </div>

    <!-- Transactions List -->
    <div class="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-gray-200 transition group"
      >
        <!-- Icon and Description -->
        <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <!-- Icon -->
          <div
            :class="{
              'bg-[#e7f6ef]': transaction.type === 'sale',
              'bg-[#fff4e6]': transaction.type === 'chapter',
              'bg-[#ffe7e7]': transaction.type === 'withdrawal',
              'bg-[#f0f3ff]': transaction.type === 'donation',
              'bg-[#f3f0ff]': transaction.type === 'sponsorship',
            }"
            class="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg shrink-0"
          >
            <span v-if="transaction.type === 'sale'">📚</span>
            <span v-else-if="transaction.type === 'chapter'">📖</span>
            <span v-else-if="transaction.type === 'withdrawal'">💸</span>
            <span v-else-if="transaction.type === 'donation'">❤️</span>
            <span v-else-if="transaction.type === 'sponsorship'">🤝</span>
          </div>

          <!-- Description -->
          <div class="flex-1 min-w-0">
            <p class="text-[12px] sm:text-[13px] font-bold text-gray-800 truncate">{{ transaction.description }}</p>
            <p class="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">{{ formatDate(transaction.date) }}</p>
          </div>
        </div>

        <!-- Amount and Status -->
        <div class="flex sm:flex-col sm:text-right items-center justify-between sm:justify-end gap-2 sm:gap-1 shrink-0">
          <p
            :class="{
              'text-[#52B788]': transaction.amount > 0,
              'text-gray-800': transaction.amount < 0,
            }"
            class="text-[12px] sm:text-[13px] font-bold"
          >
            {{ transaction.amount > 0 ? '+' : '' }}${{ Math.abs(transaction.amount).toFixed(2) }}
          </p>
          <span
            :class="{
              'bg-[#e7f6ef] text-[#52B788]': transaction.status === 'completed',
              'bg-[#fff4e6] text-[#c1712a]': transaction.status === 'pending',
            }"
            class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide px-2 sm:px-2.5 py-1 rounded-lg"
          >
            {{ transaction.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Transaction {
  id: number
  type: 'sale' | 'chapter' | 'withdrawal' | 'donation' | 'sponsorship'
  description: string
  amount: number
  date: string
  status: 'completed' | 'pending'
}

defineProps<{
  transactions: Transaction[]
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
