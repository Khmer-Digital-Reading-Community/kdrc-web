<template>
  <div class="min-h-screen bg-[#F8F9F8] py-16 px-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="font-serif text-3xl text-[#093A3F] mb-8">Frequently Asked Questions</h1>
      <div class="space-y-6">
        <div v-for="(item, i) in faqs" :key="i" class="bg-white rounded-lg p-6 border border-gray-200">
          <h3 class="font-semibold text-[#093A3F] mb-2">{{ item.q }}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">{{ item.a }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const faqs = [
  { q: "What is KDRC?", a: "KDRC (Khmer Digital Reading Community) is a digital platform dedicated to preserving and sharing Khmer literature with readers and writers around the world." },
  { q: "How do I start reading?", a: "Simply browse the Explore page to discover books across various genres. Click on any book to start reading instantly." },
  { q: "How can I publish my writing?", a: "Create an account, head to your Dashboard, and click 'Books' to start a new manuscript. Once ready, you can publish it for the community." },
  { q: "Is KDRC free to use?", a: "Yes! KDRC is free to join and read. We also offer premium features for writers who want advanced analytics and publishing tools." },
  { q: "How does Book Exchange work?", a: "Book Exchange lets you trade books with other community members. List books you're willing to trade and browse listings from others." },
];
</script>
