<template>
    <div>
        <Hero/>
        <Book_collection/>
        <Reading_continue/>
        <Explore/>
        <Recommend/>
        
    </div>

</template>

<script setup lang="ts">
// @ts-ignore: missing declaration file for .vue module
import Book_collection from '../components/Book_collection.vue';
// @ts-expect-error - Vue component import
import Hero from '../components/Hero.vue';
// @ts-expect-error - Vue component import
import Explore from '../components/Explore.vue';
// @ts-expect-error
import Reading_continue from '../components/Reading_continue.vue';
// @ts-expect-error -
import Recommend from '../components/Recommend.vue';


</script>