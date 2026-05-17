<template>
  <section class="bg-white px-14 py-14">

    <!-- Header -->
    <p class="text-[11px] font-bold tracking-[0.14em] text-[#F9AE5B] uppercase mb-2">
      Built right
    </p>
     <div class="heading-2 text-[#093A3F] mb-10">
       Safe, fast & open to all
     </div>

    <!-- Features grid -->
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="border border-[#e8e4dc] rounded-xl p-5 flex gap-4 items-flex-start
               hover:border-[#F9AE5B] hover:bg-[#faf8f3] transition-all duration-200 group"
      >
        <!-- Icon box -->
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center flex-none"
          :style="{ background: feature.iconBg }"
        >
          <svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" stroke-width="1.8"
               :style="{ color: feature.iconColor }"
               v-html="feature.iconPath">
          </svg>
        </div>

        <!-- Text -->
        <div>
          <div class="text-[13px] font-semibold text-[#093A3F] mb-1.5 group-hover:text-[#F9AE5B] transition-colors">
            {{ feature.title }}
          </div>
          <div class="text-[12px] text-gray-500 leading-relaxed">
            {{ feature.desc }}
          </div>
          <!-- Source tag -->
          <div class="mt-3">
            <span class="text-[10px] font-semibold text-gray-400 tracking-wide">
              § {{ feature.source }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  name: 'AboutTrustFeatures',
  data() {
    return {
      features: [
        {
          title: 'Secure by design',
          desc: 'JWT auth, bcrypt hashing, role-based access control. Draft chapters stay private until the author publishes them.',
          source: 'Authentication & Security',
          iconBg: '#e8f0ee',
          iconColor: '#093A3F',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
        },
        {
          title: 'Copyright protection',
          desc: 'Every published work is protected. No one can copy or claim another author\'s ideas or content without permission.',
          source: 'Out-Points §16',
          iconBg: '#fdf6e8',
          iconColor: '#F9AE5B',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>',
        },
        {
          title: 'Bilingual platform',
          desc: 'Full Khmer & English support with UTF-8 encoding throughout — so no character is ever lost or corrupted.',
          source: 'Non-Functional Requirements',
          iconBg: '#eef2fb',
          iconColor: '#3a5fa5',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>',
        },
        {
          title: 'Mobile-first',
          desc: 'Designed for smartphones first. Each chapter loads in under 1 second, optimised for Cambodia\'s network conditions.',
          source: 'Non-Functional Requirements',
          iconBg: '#f0ece4',
          iconColor: '#5a3e2b',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>',
        },
        {
          title: 'Free story sharing',
          desc: 'Share short stories freely and without limits. No paywall required to reach an audience — publish as many as you like.',
          source: 'Out-Points §16',
          iconBg: '#fbeaf0',
          iconColor: '#993556',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>',
        },
        {
          title: 'Real-time notifications',
          desc: 'Instant alerts for new chapters, comments, likes, messages, and exchange updates. Optional push via WebSockets.',
          source: 'Notification System',
          iconBg: '#e1f5ee',
          iconColor: '#0f6e56',
          iconPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>',
        },
      ],
    }
  },
}
</script>