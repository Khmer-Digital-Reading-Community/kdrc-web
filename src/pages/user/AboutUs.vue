<template>
  <div class="bg-[#F8F9F8] min-h-screen  font-sans selection:bg-[#093A3F]/10">
   <Hero/>
   <Pillars/>
   <Howitwork/>
   <Cta/>
   <Trustfeature/>
   
  </div>
</template>

<script>

import Hero from '../../components/about/hero.vue';
import Pillars from '../../components/about/pillars.vue';
import Howitwork from '../../components/about/howitwork.vue';
import Trustfeature from '../../components/about/trustfeature.vue';
import Cta from '../../components/about/cta.vue';

export default {
  name: 'AboutPage',
  components: {
    Hero,
    Pillars,
    Howitwork,
    Trustfeature,
    Cta,
  },
}
</script>