<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import BookHero from "@/components/bookdetail/BookHero.vue";
import ChapterList from "@/components/bookdetail/ChapterList.vue";
import BookTabs from "@/components/bookdetail/BookTabs.vue";
import ReviewSection from "@/components/bookdetail/ReviewSection.vue";
import AuthorSection from "@/components/bookdetail/AuthorSection.vue";
import QrPaymentDialog from "@/components/payment/QrPaymentDialog.vue";

import { useBookDetail } from "../../composables/useBookDetails";
import { useBookmarks } from "../../composables/useBookmarks";
import { usePurchases } from "../../composables/usePurchases";
import { useSubscription } from "../../composables/useSubscription";
import { token } from "../../services/auth";
import type { Chapter } from "../../types/bookDetails";

const activeTab = ref<"author" | "reviews">("reviews");
const toast = useToast();

const { book, loading, refreshBook } = useBookDetail();
const { isBookmarked, toggleBookBookmark } = useBookmarks();
const { ownedBookIds, checkChapterAccess, fetchLibrary } = usePurchases();
const { isSubscribed } = useSubscription();

const router = useRouter();

const ownedChapters = ref<Record<string, boolean>>({});

const showQrPayment = ref(false);
const qrPaymentConfig = ref<{
  itemType: "BOOK" | "CHAPTER";
  itemId: string;
  itemName: string;
  amount: number;
}>({
  itemType: "BOOK",
  itemId: "",
  itemName: "",
  amount: 0,
});

watch(book, async (b) => {
  if (!b || !token.value) return;
  if (ownedBookIds.value.has(b.id)) return;
  for (const ch of b.chapters) {
    if (!ch.isFree && ch.isPurchasable && ch.price > 0 && !ch.isPremium) {
      const owned = await checkChapterAccess(ch.id);
      ownedChapters.value = { ...ownedChapters.value, [ch.id]: owned };
    }
  }
});

const handleRead = () => {
  if (book.value) {
    router.push(`/reading/${book.value.id}`);
  }
};

const handleChapterClick = (chapterId: string) => {
  if (book.value) {
    router.push(`/reading/${book.value.id}?chapterId=${chapterId}`);
  }
};

const handleBlockedClick = (chapter: Chapter) => {
  if (!token.value) {
    toast.info("Log in to read this chapter", { timeout: 3000 });
    return;
  }
  if (chapter.isPremium) {
    toast.info("Subscribe to unlock premium chapters", {
      timeout: 4000,
      onClick: () => router.push("/subscriptions"),
    });
    return;
  }
  if (!chapter.isFree && chapter.isPurchasable && chapter.price > 0) {
    toast.info(`Purchase this chapter for $${chapter.price.toFixed(2)} to read`, {
      timeout: 4000,
    });
    return;
  }
};

const isChapterAccessible = (chapter: Chapter): boolean => {
  if (!chapter.isPublic) return false;
  if (!token.value) {
    return chapter.isFree && !chapter.isPremium;
  }
  if (chapter.isPremium) return isSubscribed.value;
  if (chapter.isFree) return true;
  if (chapter.isPurchasable && chapter.price > 0) {
    return ownedChapters.value[chapter.id] ?? false;
  }
  return book.value?.isFree ?? false;
};

const handleBookmark = async () => {
  if (!book.value) return;
  await toggleBookBookmark(book.value.id);
};

const handleQrPurchase = (config: {
  itemType: string;
  itemId: string;
  itemName: string;
  amount: number;
}) => {
  qrPaymentConfig.value = {
    itemType: config.itemType as "BOOK" | "CHAPTER",
    itemId: config.itemId,
    itemName: config.itemName,
    amount: config.amount,
  };
  showQrPayment.value = true;
};

const handleChapterPurchase = (chapter: Chapter) => {
  if (!token.value) {
    router.push("/login");
    return;
  }
  qrPaymentConfig.value = {
    itemType: "CHAPTER",
    itemId: chapter.id,
    itemName: chapter.title,
    amount: chapter.price,
  };
  showQrPayment.value = true;
};

const onQrPaymentSuccess = async () => {
  if (qrPaymentConfig.value.itemType === "BOOK" && book.value) {
    ownedBookIds.value.add(book.value.id);
    await fetchLibrary();
  } else if (qrPaymentConfig.value.itemType === "CHAPTER") {
    ownedChapters.value = {
      ...ownedChapters.value,
      [qrPaymentConfig.value.itemId]: true,
    };
  }
};

const saved = computed(() => {
  return book.value ? isBookmarked(book.value.id) : false;
});
</script>

<template>
  <div
    class="bg-[#f9fafb] text-gray-800 font-sans antialiased min-h-screen flex flex-col"
  >
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">Loading book details...</p>
    </div>

    <main
      v-else-if="book"
      class="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-10 md:py-16 w-full flex-1"
    >
      <nav class="text-xs text-gray-500 mb-8 font-medium">
        <RouterLink to="/explore" class="hover:text-gray-900 transition">
          Explore
        </RouterLink>
        <span class="mx-1"> > </span>
        <span class="text-gray-400"> Book Details </span>
      </nav>

      <BookHero
        :book="book"
        :saved="saved"
        @read="handleRead"
        @bookmark="handleBookmark"
        @purchase="handleQrPurchase"
      />

      <ChapterList
        :chapters="book.chapters"
        :isChapterAccessible="isChapterAccessible"
        @chapterClick="handleChapterClick"
        @blockedClick="handleBlockedClick"
        @chapterPurchase="handleChapterPurchase"
      />

      <div class="mt-24">
        <BookTabs :activeTab="activeTab" @change-tab="activeTab = $event" />

        <ReviewSection
          v-if="activeTab === 'reviews'"
          :book="book"
          @review-submitted="refreshBook"
        />

        <AuthorSection v-else :author="book.author" />
      </div>

      <QrPaymentDialog
        :show="showQrPayment"
        :item-type="qrPaymentConfig.itemType"
        :item-id="qrPaymentConfig.itemId"
        :item-name="qrPaymentConfig.itemName"
        :amount="qrPaymentConfig.amount"
        @close="showQrPayment = false"
        @success="onQrPaymentSuccess"
      />
    </main>

    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">Book not found.</p>
    </div>
  </div>
</template>
