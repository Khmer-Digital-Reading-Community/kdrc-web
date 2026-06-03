<template>
  <section
    class="bg-[#033C3D] rounded-3xl overflow-hidden
           flex flex-col md:flex-row"
  >
    <div
      class="flex-1 min-w-0
             p-5 sm:p-6 lg:p-10
             text-white"
    >
      <h4
        class="text-2xl sm:text-3xl lg:text-5xl
              leading-tight mb-4 font-medium font-serif"
      >
        Welcome back, {{ userName }}
      </h4>

      <p
        class="text-sm sm:text-base
               text-gray-200 leading-relaxed"
      >
        Great to see you again!
        Your creative muse has been waiting.
        Start your next masterpiece today.
      </p>
    </div>

    <div
      class="w-full md:w-[220px] lg:w-[280px]
             flex-shrink-0
             bg-[#0D4A49]
             flex items-center justify-center
             p-5 sm:p-6"
    >
      <button
        @click="navigateToCreateStory"
        class="w-full md:w-auto
               bg-[#F3A93B]
               hover:bg-[#e19a2f]
               text-black
               font-semibold
               px-5 py-4
               rounded-2xl
               transition
               text-sm sm:text-base
               cursor-pointer"
      >
        + Create New Story
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { authState } from "../../services/auth";

const router = useRouter();
console.log(authState.user.value);

const userName = computed(() => {
  const name = authState.user.value?.name?.trim();
  return name && name.length > 0 ? name : "Writer";
});

const navigateToCreateStory = () => {
  router.push("/dashboard/books/new");
};
</script>