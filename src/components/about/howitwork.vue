<template>
  <section class="bg-[#faf8f3] px-4 md:px-8 lg:px-14 py-10 md:py-12 lg:py-14">

    <!-- Header -->
    <p class="text-[11px] font-bold tracking-[0.14em] text-[#c5a050] uppercase mb-2">
      The experience
    </p>
     <div class="heading-2 text-[#1c3a2e] mb-8 md:mb-10 lg:mb-12">
       From first page to full author
     </div>

    <!-- Steps -->
     <div class="flex flex-col gap-0 max-w-[680px] mx-auto">
      <div
        v-for="(step, index) in steps"
        :key="step.title"
        class="flex gap-6 items-flex-start"
        :class="index < steps.length - 1 ? 'pb-8' : ''"
      >
        <!-- Indicator column -->
        <div class="flex flex-col items-center flex-none">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center flex-none"
            :class="index % 2 === 0 ? 'bg-[#1c3a2e]' : 'bg-[#c5a050]'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                 stroke-width="2" :class="index % 2 === 0 ? 'text-[#c5a050]' : 'text-white'"
                 v-html="step.iconPath">
            </svg>
          </div>
          <div
            v-if="index < steps.length - 1"
            class="w-px flex-1 bg-[#e8e4dc] mt-1 min-h-[44px]"
          ></div>
        </div>

        <!-- Content -->
        <div class="pt-2 pb-1">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-[11px] font-bold tracking-[0.12em] text-[#c5a050] uppercase">
              Step {{ index + 1 }}
            </span>
          </div>
           <div class="heading-3 text-[#1c3a2e] mb-2">
             {{ step.title }}
           </div>
          <p class="text-[13px] text-gray-500 leading-[1.75]">
            {{ step.desc }}
          </p>
          <!-- Example callout -->
          <div
            v-if="step.example"
            class="mt-3 bg-white border border-[#e8e4dc] rounded-xl px-4 py-3
                   flex items-start gap-2"
          >
            <span class="text-[#c5a050] mt-0.5 flex-none">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
            </span>
            <p class="text-[11px] text-gray-400 leading-relaxed italic">{{ step.example }}</p>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  name: 'AboutHowItWorks',
  data() {
    return {
      steps: [
        {
          title: 'Browse & read online',
          desc: 'Discover books by genre, author, or rating. Read in a distraction-free viewer with dark/light mode. Progress saves automatically — resume any chapter, any device.',
          example: 'A student reads a Khmer classic, leaves at chapter 5, and returns later to resume exactly where they left off.',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>',
        },
        {
          title: 'Engage with the community',
          desc: 'Rate and review books, comment on individual chapters, like content, and follow authors. Get notified when new chapters drop.',
          example: 'A reader likes a chapter and follows the author — they receive a push notification when the next chapter is published.',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>',
        },
        {
          title: 'Publish your own story',
          desc: 'Create a book, write chapters as drafts, then publish episodically. Short stories can be shared free and unlimited. Copyright protection is applied automatically to all works.',
          example: 'A reader decides to publish a short story — they gain Writer access instantly, with no separate account required.',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>',
        },
        {
          title: 'Swap, lend or sell physical copies',
          desc: 'Post your physical books to the exchange. Other users send requests; you accept or decline. Chat directly to arrange the handoff. Status tracked: Pending → Accepted → Completed.',
          example: 'A user posts "Classic Khmer Poems." Another requests a swap. They chat through the platform to arrange meetup details.',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>',
        },
      ],
    }
  },
}
</script>