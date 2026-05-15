<template>
  <section
    class="bg-[#033C3D] rounded-3xl overflow-hidden
           flex flex-col md:flex-row"
  >

    <!-- Left -->
    <div
      class="flex-1 min-w-0
             p-5 sm:p-6 lg:p-10
             text-white"
    >

      <!-- Title -->
      <h1
        class="text-2xl sm:text-3xl lg:text-5xl
               font-bold leading-tight mb-4"
      >
        Welcome back,
        <br class="hidden sm:block" />
        Piseth
      </h1>

      <!-- Description -->
      <p
        class="text-sm sm:text-base
               text-gray-200 leading-relaxed"
      >
        Great to see you again!

        Your creative muse has been waiting.

        Start your next masterpiece today.
      </p>

    </div>

    <!-- Right -->
    <div
      class="w-full md:w-[220px] lg:w-[280px]
             flex-shrink-0
             bg-[#0D4A49]
             flex items-center justify-center
             p-5 sm:p-6"
    >

      <button
        class="w-full md:w-auto
               bg-[#F3A93B]
               hover:bg-[#e19a2f]
               text-black
               font-semibold
               px-5 py-4
               rounded-2xl
               transition
               text-sm sm:text-base"
      >
        + Create New Story
      </button>

    </div>

  </section>
</template>