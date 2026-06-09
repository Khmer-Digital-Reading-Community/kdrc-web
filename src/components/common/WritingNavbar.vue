<script setup lang="ts">
import { ref } from 'vue'
import { Settings, Bell } from 'lucide-vue-next'
import icon from '../../assets/images/Icon.png'
import NotificationPopup from './NotificationPopup.vue'

interface Props {
  projectType?: 'formal-book' | 'short-story'
  isSaved?: boolean
  status?: string
}

withDefaults(defineProps<Props>(), {
  projectType: 'formal-book',
  isSaved: true,
  status: 'DRAFT'
})

const emit = defineEmits<{
  saveDraft: []
  publish: []
  changeProjectType: [type: 'formal-book' | 'short-story']
}>()

const projectType = ref<'formal-book' | 'short-story'>('formal-book')
const showNotifications = ref(false)
const notifHoverMode = ref(false)
let notifHoverTimeout: ReturnType<typeof setTimeout> | null = null

function onNotifEnter() {
  if (notifHoverTimeout) clearTimeout(notifHoverTimeout)
  notifHoverMode.value = true
  showNotifications.value = true
}

function onNotifLeave() {
  notifHoverTimeout = setTimeout(() => {
    showNotifications.value = false
    notifHoverMode.value = false
  }, 200)
}

function onNotifPopupEnter() {
  if (notifHoverTimeout) clearTimeout(notifHoverTimeout)
}

function onNotifPopupLeave() {
  notifHoverTimeout = setTimeout(() => {
    showNotifications.value = false
    notifHoverMode.value = false
  }, 200)
}
</script>

<template>
  <nav class="bg-[#093A3F] w-full border-b border-gray-700 px-6 py-3 flex items-center justify-between">
    <!-- Left: Logo -->
    <router-link to="/" class="flex items-center gap-2 no-underline">
      <img :src="icon" alt="KDRC Logo" class="w-6 h-6" />
      <span class="text-[#FDE9D0] font-semibold tracking-wide">KDRC</span>
    </router-link>

    <!-- Center: Project Type Tabs -->
    <div class="flex gap-1 ml-8">
      <button
        :class="[
          'px-4 py-1.5 text-sm font-medium rounded transition-colors',
          projectType === 'formal-book'
            ? 'bg-[#F9AE5B] text-[#093A3F]'
            : 'text-[#FDE9D0]/70 hover:text-[#FDE9D0]'
        ]"
        @click="projectType = 'formal-book'; emit('changeProjectType', 'formal-book')"
      >
        Formal Book
      </button>
      <button
        :class="[
          'px-4 py-1.5 text-sm font-medium rounded transition-colors',
          projectType === 'short-story'
            ? 'bg-[#F9AE5B] text-[#093A3F]'
            : 'text-[#FDE9D0]/70 hover:text-[#FDE9D0]'
        ]"
        @click="projectType = 'short-story'; emit('changeProjectType', 'short-story')"
      >
        Short Story
      </button>
    </div>

    <!-- Right: Actions & Settings -->
    <div class="flex items-center gap-4 ml-auto">
      <button
        @click="emit('saveDraft')"
        :class="[
          'px-4 py-1.5 text-sm font-medium rounded transition-colors',
          isSaved ? 'text-gray-400' : 'text-[#FDE9D0] hover:bg-[#0d4d54]'
        ]"
      >
        {{ isSaved ? '✓ Saved' : 'Save Draft' }}
      </button>

      <button
        @click="emit('publish')"
        :disabled="status === 'PUBLISHED'"
        :class="[
          'px-4 py-1.5 text-sm font-medium rounded transition-opacity',
          status === 'PUBLISHED' 
            ? 'bg-gray-500 text-white cursor-not-allowed opacity-50' 
            : 'bg-[#F9AE5B] text-[#093A3F] hover:opacity-90'
        ]"
      >
        {{ status === 'PUBLISHED' ? 'Published' : 'Publish' }}
      </button>

      <button
        class="text-[#FDE9D0]/70 hover:text-[#FDE9D0] transition-colors"
        @click="showNotifications = !showNotifications"
        @mouseenter="onNotifEnter"
        @mouseleave="onNotifLeave"
      >
        <Bell :size="20" />
      </button>

      <button class="text-[#FDE9D0]/70 hover:text-[#FDE9D0] transition-colors">
        <Settings :size="20" />
      </button>
    </div>
  </nav>

  <!-- Notification Popup -->
  <NotificationPopup
    :isOpen="showNotifications"
    :hoverMode="notifHoverMode"
    @close="showNotifications = false"
    @popupEnter="onNotifPopupEnter"
    @popupLeave="onNotifPopupLeave"
  />
</template>
