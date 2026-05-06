<template>
  <div
    class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
  >

    <!-- Search -->
    <div class="relative w-full lg:w-[320px]">

      <input
        type="text"
        placeholder="Search your manuscripts..."
        class="w-full bg-[#EFE9DE] rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
      />

      <span class="absolute left-3 top-3 text-gray-400">
      </span>

    </div>

    <!-- Filters -->
    <div
      class="flex items-center bg-[#EFE9DE] rounded-xl overflow-hidden"
    >

      <button class="px-5 py-3 bg-white text-sm font-medium">
        All
      </button>

      <button class="px-5 py-3 text-sm text-gray-500">
        Drafts
      </button>

      <button class="px-5 py-3 text-sm text-gray-500">
        Published
      </button>

      <button class="px-5 py-3 text-sm text-gray-500">
        Archived
      </button>

    </div>

  </div>
</template>