<template>
  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
    <section class="rounded-[28px] bg-white border border-[#E6E0D4] p-8 md:p-10 shadow-[0_18px_45px_rgba(15,59,53,0.06)]">

      <div class="flex items-center gap-4 mb-8">
        <img
          v-if="author.image"
          :src="author.image"
          :alt="author.name"
          @error="onAvatarError"
          class="w-18 h-18 rounded-2xl object-cover border border-[#E6E0D4]"
        />

        <div
          v-else
          class="w-18 h-18 rounded-2xl bg-[#0F3B35] text-white flex items-center justify-center text-2xl font-bold"
        >
          {{ authorInitial }}
        </div>

        <div>
          <h2 class="text-3xl font-bold text-gray-900">
            {{ author.name }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Author profile
          </p>
        </div>
      </div>

      <p class="text-gray-600 leading-8 text-base whitespace-pre-line">
        {{ author.bio || "No biography has been added for this author yet." }}
      </p>
    </section>

    <aside class="rounded-[28px] overflow-hidden border border-[#E6E0D4] bg-[#0F3B35] text-white shadow-[0_18px_45px_rgba(15,59,53,0.08)]">
      <div class="aspect-[4/5] bg-[#133F39]">
        <img
          v-if="author.image"
          :src="author.image"
          :alt="author.name"
          @error="onAvatarError"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-7xl font-black text-white/80"
        >
          {{ authorInitial }}
        </div>
      </div>

      <div class="p-6 border-t border-white/10">
        <p class="text-xs uppercase tracking-[0.24em] text-white/60 mb-2">
          Featured Author
        </p>
        <h3 class="text-2xl font-bold">
          {{ author.name }}
        </h3>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Author } from "../../types/bookDetails";

const props = defineProps<{
  author: Author;
}>();

const authorInitial = computed(() =>
  props.author.name?.trim().charAt(0).toUpperCase() || "A",
);

function onAvatarError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.style.display = "none";
}
</script>
