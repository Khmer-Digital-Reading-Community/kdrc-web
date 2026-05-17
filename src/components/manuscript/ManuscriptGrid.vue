<script setup lang="ts">
import ManuscriptCard from './ManuscriptCard.vue'
import CreateStoryCard from './CreateStoryCard.vue'
</script>

<template>
  <section
    class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
  >

    <ManuscriptCard
      title="The Echoes of Angkor"
      words="14k words"
      edit="2h ago"
      status="Published"
    />

    <ManuscriptCard
      title="Silk Road Chronicles"
      words="8.2k words"
      edit="5h ago"
      status="Draft"
    />

    <ManuscriptCard
      title="Beneath the Banyan"
      words="12k words"
      edit="1d ago"
      status="Draft"
    />

    <CreateStoryCard />

  </section>
</template>