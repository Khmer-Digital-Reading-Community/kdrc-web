<script setup lang="ts">
import heroImage from '../../assets/images/image1 1.png'
</script>

<template>
    <main class="w-full bg-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div class="flex flex-col items-start z-10">
                <span class="text-[#B4690E] text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
                    Cultural Preservation
                </span>

                <h1 class="text-5xl md:text-6xl lg:text-7xl font-serif text-[#093A3F]! leading-[1.1] mt-0!">
                    Read, Write,<br />and Belong.
                </h1>
                
                <p class="text-[#4A6466] text-lg leading-relaxed mb-10 max-w-lg">
                    Enter the digital sanctuary of Khmer leterature. KDRC bridges centuries of ancient storytelling with a modern community of writers, archibists, and readers.
                </p>

                <div class="flex flex-wrap gap-4 mt-4">
                    <router-link to="/home" class="bg-[#093A3F] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#072c30] transition-colors shadow-md">
                        Explore Library
                    </router-link>

                    <router-link to="/signup" class="bg-white text-[#093A3F] border border-gray-200 shadow-sm px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-colors">
                        Publish Story
                    </router-link>
                </div>
            </div>

            <div class="relative w-full mt-12 lg:mt-0 justify-center lg:justify-end">

                <img :src="heroImage" 
                alt="KDRC Illustration"
                class="w-full max-w-lg lg:max-"
                />

                <div class="absolute -bottom-6 left-2 md:left-10 lg:-left-7 bg-white px-5 pb-5 pt-3 md:px-5 md:pb-5 md:pt-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-40 z-20 text-left">
                    <div class="-translate-y-1 flex flex-col items-center">
                        <p class="text-[#B4690E] font-serif italic text-lg md:text-xl leading-snug md-4">
                            "Literature is the memory of a nation"
                        </p>

                        <div class="flex w-full items-center justify-start gap-3 -mt-2">
                            <div class="h-px text-gray-300">
                                <span class="text-[10px] text-gray-400 font-bold tracking-widest uppercase text-left">
                                    KDRC Archives
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>