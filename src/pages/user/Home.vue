<template >
    <div>
        <Hero/>
        <Book_collection/>
        <Reading_continue/>

        <Explore/>
        
        <Recommend/>
        
    </div>
    

</template>

<script setup lang="ts">

import Book_collection from '../../components/home/Book_collection.vue';
import Hero from '../../components/home/Hero.vue';
import Explore from '../../components/home/Explore.vue';
import Reading_continue from '../../components/home/Reading_continue.vue';
import Recommend from '../../components/home/Recommend.vue';

</script>