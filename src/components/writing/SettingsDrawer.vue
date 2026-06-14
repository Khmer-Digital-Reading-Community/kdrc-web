<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="show"
        class="fixed inset-0 z-40 flex justify-end"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

        <!-- Drawer -->
        <div
          class="relative w-full max-w-lg bg-[#FCFAF7] h-full shadow-2xl overflow-hidden flex flex-col"
        >
          <!-- Header -->
          <div
            class="flex-shrink-0 relative overflow-hidden bg-white border-b border-gray-100 px-6 pt-5 pb-5"
          >
            <!-- Decorative background icons -->
            <div
              class="absolute -top-6 -right-6 opacity-[0.04] pointer-events-none"
            >
              <BookHeart :size="140" class="text-[#123C3A]" />
            </div>
            <div
              class="absolute -bottom-4 left-1/2 opacity-[0.03] pointer-events-none"
            >
              <Feather :size="100" class="text-[#123C3A]" />
            </div>

            <div class="relative">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <!-- Featured icon -->
                  <div class="relative">
                    <div
                      class="absolute inset-0 rounded-2xl bg-[#c5a050]/15 blur-lg"
                    ></div>
                    <div
                      class="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#c5a050]/20 to-[#c5a050]/5 border border-[#c5a050]/25 flex items-center justify-center"
                    >
                      <BookMarked :size="22" class="text-[#c5a050]" />
                    </div>
                  </div>
                  <div class="min-w-0">
                    <h2
                      class="text-lg font-bold text-[#123C3A] leading-tight tracking-tight truncate"
                    >
                      Book Settings
                    </h2>
                    <p
                      v-if="book"
                      class="text-xs text-gray-400 mt-0.5 truncate max-w-[220px] flex items-center gap-1.5"
                    >
                      <PenLine
                        :size="11"
                        class="text-[#c5a050]/70 flex-shrink-0"
                      />
                      {{ book.title || "Untitled" }}
                    </p>
                  </div>
                </div>
                <button
                  @click="$emit('close')"
                  class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition flex items-center justify-center flex-shrink-0"
                >
                  <X :size="18" />
                </button>
              </div>

              <!-- Status + stats bar -->
              <div v-if="book" class="flex items-center gap-2.5 mt-4 flex-wrap">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
                    statusBadgeClass,
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full',
                      book.status === 'PUBLISHED'
                        ? 'bg-emerald-500'
                        : book.status === 'ARCHIVED'
                          ? 'bg-gray-400'
                          : book.status === 'DISCONTINUED'
                            ? 'bg-red-400'
                            : 'bg-amber-500',
                    ]"
                  ></span>
                  {{ book.status || "DRAFT" }}
                </span>
                <span
                  class="inline-flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-wider"
                >
                  <BookOpen :size="11" />
                  {{ chapterCount }} chapters
                </span>
                <span
                  class="inline-flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-wider"
                >
                  <Type :size="11" />
                  {{ totalWords }} words
                </span>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div
            class="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-2"
          >
            <div class="flex bg-gray-100 rounded-xl p-1 gap-0.5">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                :class="[
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                  activeTab === tab.key
                    ? 'bg-white text-[#123C3A] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                <component :is="tab.icon" :size="13" />
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <!-- ===================== BOOK INFO TAB ===================== -->
            <div v-if="activeTab === 'Book Info'" class="p-5 space-y-5">
              <!-- Cover Card -->
              <div class="bg-white rounded-2xl border border-gray-100 p-4">
                <h3
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3"
                >
                  Cover Image
                </h3>
                <div class="flex gap-4 items-start">
                  <div
                    :class="[
                      'relative w-28 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-black/5',
                      !localCoverPreview &&
                        'bg-gradient-to-br from-gray-100 to-gray-50',
                    ]"
                  >
                    <img
                      v-if="localCoverPreview"
                      :src="localCoverPreview"
                      alt="Cover"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex flex-col items-center justify-center text-gray-300"
                    >
                      <ImageIcon :size="28" />
                      <span class="text-[9px] font-medium mt-1">No cover</span>
                    </div>
                    <button
                      v-if="localCoverPreview"
                      @click="$emit('removeCover')"
                      class="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition shadow-sm"
                    >
                      <X :size="12" />
                    </button>
                  </div>

                  <div
                    class="flex-1 flex flex-col justify-center gap-2 min-h-[140px]"
                  >
                    <p class="text-xs text-gray-500 leading-relaxed">
                      Upload a 3:2 cover image. JPEG or PNG, recommended size
                      1200&times;800px.
                    </p>
                    <label
                      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F6F1E8] text-[#123C3A] text-xs font-semibold hover:bg-[#efe4d2] active:scale-[0.98] transition cursor-pointer self-start border border-[#e8d9c0]"
                    >
                      <Upload :size="14" />
                      {{ localCoverPreview ? "Change Cover" : "Upload Cover" }}
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        class="hidden"
                        @change="onCoverChange"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <!-- Basic Info Card -->
              <div
                class="bg-white rounded-2xl border border-gray-100 p-4 space-y-4"
              >
                <h3
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                >
                  Basic Info
                </h3>

                <div>
                  <label
                    class="block text-xs font-semibold text-[#123C3A] mb-1.5"
                  >
                    Title <span class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="localTitle"
                    type="text"
                    placeholder="Enter book title"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#123C3A] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] transition"
                  />
                </div>

                <div>
                  <label
                    class="block text-xs font-semibold text-[#123C3A] mb-1.5"
                    >Description</label
                  >
                  <textarea
                    v-model="localDescription"
                    rows="3"
                    placeholder="A short description of your book..."
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#123C3A] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] resize-none transition"
                  ></textarea>
                  <p class="text-[10px] text-gray-400 mt-1">
                    {{ localDescription.length }} characters
                  </p>
                </div>
              </div>

              <!-- Classification Card -->
              <div
                class="bg-white rounded-2xl border border-gray-100 p-4 space-y-4"
              >
                <h3
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                >
                  Classification
                </h3>

                <!-- Genre: searchable single-select + create -->
                <div>
                  <label
                    class="block text-xs font-semibold text-[#123C3A] mb-1.5"
                  >
                    Genre
                    <span class="text-gray-400 font-normal"
                      >(select or create)</span
                    >
                  </label>
                  <SearchableSelect
                    :modelValue="localGenreSlug"
                    :options="genreOptions"
                    placeholder="Search or type a new genre..."
                    emptyText="No genres found"
                    createLabel="Create genre"
                    @update:modelValue="localGenreSlug = $event"
                    @create="handleCreateGenre"
                  />
                </div>

                <!-- Categories: multi-select + create (replaces pill buttons) -->
                <div>
                  <label
                    class="block text-xs font-semibold text-[#123C3A] mb-2"
                  >
                    Categories
                    <span
                      v-if="localCategorySlugs.length"
                      class="text-gray-400 font-normal ml-1"
                    >
                      ({{ localCategorySlugs.length }} selected)
                    </span>
                  </label>
                  <MultiSelect
                    :modelValue="localCategorySlugs"
                    :options="categoryOptions"
                    placeholder="Search or create categories..."
                    emptyText="No categories found"
                    createLabel="Create category"
                    @update:modelValue="localCategorySlugs = $event"
                    @create="handleCreateCategory"
                  />
                </div>

                <!-- Tags: multi-select + create -->
                <div>
                  <label
                    class="block text-xs font-semibold text-[#123C3A] mb-2"
                  >
                    Tags
                    <span
                      v-if="localTagSlugs.length"
                      class="text-gray-400 font-normal ml-1"
                    >
                      ({{ localTagSlugs.length }})
                    </span>
                  </label>
                  <MultiSelect
                    :modelValue="localTagSlugs"
                    :options="tagOptions"
                    placeholder="Search or create tags..."
                    emptyText="No tags found"
                    createLabel="Create tag"
                    @update:modelValue="localTagSlugs = $event"
                    @create="handleCreateTag"
                  />
                </div>
              </div>

              <!-- Save -->
              <button
                @click="
                  $emit('saveMetadata', {
                    title: localTitle,
                    description: localDescription,
                    genreSlug: localGenreSlug,
                    categorySlugs: localCategorySlugs,
                    tagSlugs: localTagSlugs,
                  })
                "
                :disabled="saving"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-[#c5a050] to-[#b09040] text-white text-sm font-bold hover:from-[#b09040] hover:to-[#9a7a30] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm"
              >
                <span v-if="saving" class="inline-flex items-center gap-2">
                  <Loader2 :size="15" class="animate-spin" />
                  Saving...
                </span>
                <span v-else>Save Book Info</span>
              </button>
            </div>

            <!-- ===================== PRICING TAB ===================== -->
            <div v-if="activeTab === 'Pricing'" class="p-5 space-y-5">
              <!-- Pricing Model: Radio-style cards -->
              <div class="bg-white rounded-2xl border border-gray-100 p-4">
                <h3
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4"
                >
                  Monetization Model
                </h3>

                <div class="space-y-2.5">
                  <!-- Free -->
                  <label
                    @click="pricingModel = 'free'"
                    :class="[
                      'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      pricingModel === 'free'
                        ? 'border-emerald-400 bg-emerald-50/40 shadow-sm'
                        : 'border-gray-150 hover:border-gray-300 bg-white',
                    ]"
                  >
                    <div
                      :class="[
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                        pricingModel === 'free'
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-gray-300 bg-white',
                      ]"
                    >
                      <div
                        v-if="pricingModel === 'free'"
                        class="w-2 h-2 rounded-full bg-white"
                      ></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-[#123C3A]">Free</p>
                      <p class="text-xs text-gray-400 mt-0.5">
                        Anyone can read this book at no cost. Best for building
                        an audience.
                      </p>
                    </div>
                    <Gift :size="20" class="text-emerald-400 flex-shrink-0" />
                  </label>

                  <!-- One-time Purchase -->
                  <label
                    @click="pricingModel = 'purchasable'"
                    :class="[
                      'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      pricingModel === 'purchasable'
                        ? 'border-[#c5a050] bg-amber-50/30 shadow-sm'
                        : 'border-gray-150 hover:border-gray-300 bg-white',
                    ]"
                  >
                    <div
                      :class="[
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                        pricingModel === 'purchasable'
                          ? 'border-[#c5a050] bg-[#c5a050]'
                          : 'border-gray-300 bg-white',
                      ]"
                    >
                      <div
                        v-if="pricingModel === 'purchasable'"
                        class="w-2 h-2 rounded-full bg-white"
                      ></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-[#123C3A]">
                        One-time Purchase
                      </p>
                      <p class="text-xs text-gray-400 mt-0.5">
                        Readers pay once to unlock the full book. You set the
                        price below.
                      </p>
                    </div>
                    <DollarSign
                      :size="20"
                      class="text-[#c5a050] flex-shrink-0"
                    />
                  </label>

                  <!-- Premium / Subscription -->
                  <label
                    @click="pricingModel = 'premium'"
                    :class="[
                      'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      pricingModel === 'premium'
                        ? 'border-amber-400 bg-amber-50/40 shadow-sm'
                        : 'border-gray-150 hover:border-gray-300 bg-white',
                    ]"
                  >
                    <div
                      :class="[
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                        pricingModel === 'premium'
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-gray-300 bg-white',
                      ]"
                    >
                      <div
                        v-if="pricingModel === 'premium'"
                        class="w-2 h-2 rounded-full bg-white"
                      ></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-[#123C3A]">
                        Premium / Subscription
                      </p>
                      <p class="text-xs text-gray-400 mt-0.5">
                        Only accessible to subscribers. Monetize through the
                        platform subscription pool.
                      </p>
                    </div>
                    <Crown :size="20" class="text-amber-400 flex-shrink-0" />
                  </label>
                </div>
              </div>

              <!-- Price input (only for purchasable) -->
              <div
                v-if="pricingModel === 'purchasable'"
                class="bg-white rounded-2xl border border-gray-100 p-4"
              >
                <h3
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3"
                >
                  Set Price
                </h3>
                <div>
                  <label
                    class="block text-xs font-semibold text-[#123C3A] mb-1.5"
                    >Price per Book</label
                  >
                  <div class="relative">
                    <span
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium"
                      >$</span
                    >
                    <input
                      v-model.number="localPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      class="w-full rounded-xl border border-gray-200 pl-8 pr-12 py-2.5 text-sm text-[#123C3A] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] transition"
                    />
                    <span
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium"
                      >credits</span
                    >
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1.5">
                    You receive 70% of the listed price. Platform commission is
                    30%.
                  </p>
                </div>
              </div>

              <!-- Revenue callout for purchasable -->
              <div
                v-if="pricingModel === 'purchasable'"
                class="bg-amber-50/60 rounded-xl px-4 py-3 border border-amber-100/60"
              >
                <div class="flex gap-2.5 items-start">
                  <Info
                    :size="15"
                    class="text-amber-500 flex-shrink-0 mt-0.5"
                  />
                  <p class="text-xs text-amber-800 leading-relaxed">
                    <span class="font-semibold">Revenue estimate:</span>
                    At {{ localPrice || "0" }} credits per sale, you'll earn
                    <span class="font-semibold"
                      >{{ ((localPrice || 0) * 0.7).toFixed(2) }} credits</span
                    >
                    after commission.
                  </p>
                </div>
              </div>

              <!-- Save -->
              <button
                @click="emitPricing"
                :disabled="saving"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-[#c5a050] to-[#b09040] text-white text-sm font-bold hover:from-[#b09040] hover:to-[#9a7a30] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm"
              >
                <span v-if="saving" class="inline-flex items-center gap-2">
                  <Loader2 :size="15" class="animate-spin" />
                  Saving...
                </span>
                <span v-else>Save Pricing</span>
              </button>
            </div>

            <!-- ===================== CHAPTER TAB ===================== -->
            <div
              v-if="activeTab === 'Chapter' && selectedChapter"
              class="p-5 space-y-5"
            >
              <!-- Chapter Hero Card -->
              <div
                class="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5"
              >
                <!-- Decorative chapter number watermark -->
                <div
                  class="absolute -top-3 -right-3 text-6xl font-black text-gray-100/60 pointer-events-none select-none"
                >
                  #{{
                    selectedChapter.chapterNumber ??
                    selectedChapter.order ??
                    "?"
                  }}
                </div>
                <div class="relative">
                  <div class="flex items-start gap-4">
                    <div class="relative flex-shrink-0">
                      <div
                        class="absolute inset-0 rounded-2xl bg-[#c5a050]/15 blur-md"
                      ></div>
                      <div
                        class="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F6F1E8] to-[#efe4d2] border border-[#e8d9c0] flex items-center justify-center"
                      >
                        <component
                          :is="chapterTypeIcon"
                          :size="22"
                          class="text-[#c5a050]"
                        />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3
                        class="text-base font-bold text-[#123C3A] leading-snug"
                      >
                        {{ selectedChapter.title }}
                      </h3>
                      <div class="flex items-center gap-2 mt-1.5">
                        <span
                          class="inline-flex items-center gap-1 text-[11px] text-gray-400"
                        >
                          <Type :size="11" />
                          {{ selectedChapter.wordCount ?? 0 }} words
                        </span>
                        <span class="text-gray-300">&middot;</span>
                        <span
                          class="inline-flex items-center gap-1 text-[11px] text-gray-400"
                        >
                          <Clock :size="11" />
                          ~{{
                            Math.max(
                              1,
                              Math.ceil((selectedChapter.wordCount ?? 0) / 200),
                            )
                          }}
                          min read
                        </span>
                      </div>
                    </div>
                    <span
                      :class="[
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0',
                        selectedChapter.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : selectedChapter.status === 'ARCHIVED'
                            ? 'bg-gray-100 text-gray-500 border border-gray-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200',
                      ]"
                    >
                      <span
                        :class="[
                          'w-1.5 h-1.5 rounded-full',
                          selectedChapter.status === 'PUBLISHED'
                            ? 'bg-emerald-500'
                            : selectedChapter.status === 'ARCHIVED'
                              ? 'bg-gray-400'
                              : 'bg-amber-500',
                        ]"
                      ></span>
                      {{ selectedChapter.status }}
                    </span>
                  </div>

                  <!-- Chapter progress bar -->
                  <div
                    class="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-gradient-to-r from-[#c5a050] to-[#b09040] rounded-full transition-all duration-500"
                      :style="{
                        width:
                          Math.min(
                            100,
                            Math.max(
                              2,
                              ((selectedChapter.wordCount ?? 0) / 5000) * 100,
                            ),
                          ) + '%',
                      }"
                    ></div>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1 text-right">
                    {{ selectedChapter.wordCount ?? 0 }} / 5,000 words typical
                  </p>
                </div>
              </div>

              <!-- Chapter Info Card -->
              <div
                class="bg-white rounded-2xl border border-gray-100 p-4 space-y-4"
              >
                <h3
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FileText :size="12" /> Chapter Details
                </h3>

                <div>
                  <label
                    class="block text-xs font-semibold text-[#123C3A] mb-1.5"
                    >Title</label
                  >
                  <input
                    v-model="chapterTitle"
                    type="text"
                    placeholder="Chapter title"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#123C3A] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] transition"
                  />
                </div>

                <!-- Chapter Type: Visual radio cards -->
                <div>
                  <label class="block text-xs font-semibold text-[#123C3A] mb-2"
                    >Type</label
                  >
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="ct in chapterTypes"
                      :key="ct.value"
                      @click="chapterType = ct.value"
                      :class="[
                        'flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200 text-left',
                        chapterType === ct.value
                          ? 'border-[#c5a050] bg-amber-50/30 shadow-sm'
                          : 'border-gray-150 hover:border-gray-300 bg-white',
                      ]"
                    >
                      <component
                        :is="ct.icon"
                        :size="16"
                        :class="
                          chapterType === ct.value
                            ? 'text-[#c5a050]'
                            : 'text-gray-400'
                        "
                      />
                      <div>
                        <p
                          :class="[
                            'text-xs font-semibold',
                            chapterType === ct.value
                              ? 'text-[#123C3A]'
                              : 'text-gray-600',
                          ]"
                        >
                          {{ ct.label }}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-xs font-semibold text-[#123C3A] mb-1.5"
                    >Description</label
                  >
                  <textarea
                    v-model="chapterDescription"
                    rows="2"
                    placeholder="Optional chapter description..."
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#123C3A] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] resize-none transition"
                  ></textarea>
                </div>
              </div>

              <!-- Chapter Pricing Card -->
              <div
                class="bg-white rounded-2xl border border-gray-100 p-4 space-y-4"
              >
                <h3
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <DollarSign :size="12" /> Chapter Pricing
                </h3>

                <div class="space-y-2.5">
                  <!-- Use book default -->
                  <label
                    @click="chapterPricingModel = 'default'"
                    :class="[
                      'flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      chapterPricingModel === 'default'
                        ? 'border-gray-400 bg-gray-50/60 shadow-sm'
                        : 'border-gray-150 hover:border-gray-300 bg-white',
                    ]"
                  >
                    <div
                      :class="[
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                        chapterPricingModel === 'default'
                          ? 'border-gray-500 bg-gray-500'
                          : 'border-gray-300 bg-white',
                      ]"
                    >
                      <div
                        v-if="chapterPricingModel === 'default'"
                        class="w-2 h-2 rounded-full bg-white"
                      ></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-[#123C3A]">Book Default</p>
                      <p class="text-xs text-gray-400 mt-0.5">
                        Follow the book's pricing model. No override needed.
                      </p>
                    </div>
                    <BookOpen :size="18" class="text-gray-400 flex-shrink-0" />
                  </label>

                  <!-- Purchasable override -->
                  <label
                    @click="chapterPricingModel = 'purchasable'"
                    :class="[
                      'flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      chapterPricingModel === 'purchasable'
                        ? 'border-[#c5a050] bg-amber-50/30 shadow-sm'
                        : 'border-gray-150 hover:border-gray-300 bg-white',
                    ]"
                  >
                    <div
                      :class="[
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                        chapterPricingModel === 'purchasable'
                          ? 'border-[#c5a050] bg-[#c5a050]'
                          : 'border-gray-300 bg-white',
                      ]"
                    >
                      <div
                        v-if="chapterPricingModel === 'purchasable'"
                        class="w-2 h-2 rounded-full bg-white"
                      ></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-[#123C3A]">One-time Purchase</p>
                      <p class="text-xs text-gray-400 mt-0.5">
                        Readers can buy this specific chapter individually.
                      </p>
                    </div>
                    <DollarSign :size="18" class="text-[#c5a050] flex-shrink-0" />
                  </label>

                  <!-- Premium override -->
                  <label
                    @click="chapterPricingModel = 'premium'"
                    :class="[
                      'flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      chapterPricingModel === 'premium'
                        ? 'border-amber-400 bg-amber-50/40 shadow-sm'
                        : 'border-gray-150 hover:border-gray-300 bg-white',
                    ]"
                  >
                    <div
                      :class="[
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                        chapterPricingModel === 'premium'
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-gray-300 bg-white',
                      ]"
                    >
                      <div
                        v-if="chapterPricingModel === 'premium'"
                        class="w-2 h-2 rounded-full bg-white"
                      ></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-[#123C3A]">Premium / Subscription</p>
                      <p class="text-xs text-gray-400 mt-0.5">
                        Only accessible to subscribers. Override to premium-only.
                      </p>
                    </div>
                    <Crown :size="18" class="text-amber-400 flex-shrink-0" />
                  </label>
                </div>

                <!-- Price override input (only when purchasable) -->
                <div v-if="chapterPricingModel === 'purchasable'">
                  <div class="border-t border-gray-100 pt-4">
                    <label
                      class="block text-xs font-semibold text-[#123C3A] mb-1.5"
                      >Price Override</label
                    >
                    <div class="relative">
                      <span
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium"
                        >$</span
                      >
                      <input
                        v-model.number="chapterPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        class="w-full rounded-xl border border-gray-200 pl-8 pr-14 py-2.5 text-sm text-[#123C3A] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] transition"
                      />
                      <span
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium"
                        >credits</span
                      >
                    </div>
                    <p class="text-[10px] text-gray-400 mt-1">
                      Set a custom price for this chapter only.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Save Chapter -->
              <button
                @click="
                  $emit('saveChapter', {
                    id: selectedChapter.id,
                    title: chapterTitle,
                    type: chapterType,
                    description: chapterDescription,
                    price: chapterPrice,
                    isPurchasable: chapterPricingModel === 'purchasable',
                    isPremium: chapterPricingModel === 'premium',
                  })
                "
                :disabled="saving"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-[#c5a050] to-[#b09040] text-white text-sm font-bold hover:from-[#b09040] hover:to-[#9a7a30] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm"
              >
                <span v-if="saving" class="inline-flex items-center gap-2">
                  <Loader2 :size="15" class="animate-spin" />
                  Saving...
                </span>
                <span v-else>Save Chapter</span>
              </button>

              <!-- Status Actions Card -->
              <div class="bg-white rounded-2xl border border-gray-100 p-4">
                <h3
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3"
                >
                  <GitBranch :size="12" /> Status
                </h3>
                <div class="flex gap-2">
                  <button
                    v-if="selectedChapter.status !== 'PUBLISHED'"
                    @click="
                      $emit('setChapterStatus', selectedChapter.id, 'PUBLISHED')
                    "
                    class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 active:scale-[0.98] transition border border-emerald-200/50"
                  >
                    <Send :size="12" />
                    Publish
                  </button>
                  <button
                    v-if="selectedChapter.status !== 'DRAFT'"
                    @click="
                      $emit('setChapterStatus', selectedChapter.id, 'DRAFT')
                    "
                    class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 active:scale-[0.98] transition border border-amber-200/50"
                  >
                    <Undo2 :size="12" />
                    Unpublish
                  </button>
                  <button
                    v-if="selectedChapter.status !== 'ARCHIVED'"
                    @click="
                      $emit('setChapterStatus', selectedChapter.id, 'ARCHIVED')
                    "
                    class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 active:scale-[0.98] transition border border-gray-200/50"
                  >
                    <Archive :size="12" />
                    Archive
                  </button>
                </div>
              </div>

              <!-- Danger Zone -->
              <div class="bg-white rounded-2xl border border-red-100 p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3
                      class="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <AlertTriangle :size="11" /> Danger Zone
                    </h3>
                    <p class="text-[11px] text-gray-400 mt-0.5">
                      Permanently delete this chapter and its content
                    </p>
                  </div>
                  <button
                    @click="$emit('deleteChapter', selectedChapter.id)"
                    class="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 active:scale-[0.98] transition"
                  >
                    <Trash2 :size="12" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex-shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur px-5 py-3"
          >
            <button
              @click="$emit('close')"
              class="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 hover:text-gray-700 active:scale-[0.98] transition"
            >
              Close Settings
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  X,
  BookOpen,
  Upload,
  FileText,
  Info,
  Loader2,
  ImageIcon,
  Gift,
  DollarSign,
  Crown,
  BookHeart,
  Feather,
  BookMarked,
  PenLine,
  Type,
  Clock,
  GitBranch,
  Send,
  Undo2,
  Archive,
  AlertTriangle,
  Trash2,
  BookTemplate,
  ScrollText,
  Star,
} from "lucide-vue-next";
import SearchableSelect from "./SearchableSelect.vue";
import MultiSelect from "./MultiSelect.vue";
import type { Genre, Category, Tag } from "../../services/bookApi";
import type { Chapter } from "../../services/chapterApi";

const props = defineProps<{
  show: boolean;
  book: any;
  selectedChapter?: Chapter | null;
  genres: Genre[];
  categories: Category[];
  tags: Tag[];
  saving?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  saveMetadata: [
    data: {
      title: string;
      description: string;
      genreSlug: string;
      categorySlugs: string[];
      tagSlugs: string[];
    },
  ];
  savePricing: [
    data: {
      isFree: boolean;
      price: number;
      isPurchasable: boolean;
      isPremium: boolean;
    },
  ];
  saveChapter: [
    data: {
      id: string;
      title: string;
      type: string;
      description: string;
      price: number;
      isPurchasable: boolean;
      isPremium: boolean;
    },
  ];
  setChapterStatus: [
    chapterId: string,
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
  ];
  deleteChapter: [chapterId: string];
  removeCover: [];
  coverFileSelected: [file: File];
  // New events for creating classification items
  createGenre: [name: string];
  createCategory: [name: string];
  createTag: [name: string];
}>();

const activeTab = ref("Book Info");
const tabs = computed(() => {
  const base = [
    { key: "Book Info", label: "Book Info", icon: Info },
    { key: "Pricing", label: "Pricing", icon: DollarSign },
  ];
  if (props.selectedChapter) {
    base.push({ key: "Chapter", label: "Chapter", icon: FileText });
  }
  return base;
});

// ── Book Info state ──
const localTitle = ref("");
const localDescription = ref("");
const localGenreSlug = ref("");
const localCategorySlugs = ref<string[]>([]);
const localTagSlugs = ref<string[]>([]);
const localCoverPreview = ref<string | null>(null);

// ── Pricing state ──
// Radio-style: 'free' | 'purchasable' | 'premium'
const pricingModel = ref<"free" | "purchasable" | "premium">("free");
const localPrice = ref(0);

// ── Chapter state ──
const chapterTitle = ref("");
const chapterDescription = ref("");
const chapterType = ref("CHAPTER");
const chapterPrice = ref(0);
// Radio-style: 'default' | 'purchasable' | 'premium'
const chapterPricingModel = ref<"default" | "purchasable" | "premium">("default");

// ── Derived options for classification comboboxes ──
const genreOptions = computed(() =>
  props.genres.map((g) => ({ value: g.slug, label: g.name })),
);
const categoryOptions = computed(() =>
  props.categories.map((c) => ({ value: c.slug, label: c.name })),
);
const tagOptions = computed(() =>
  props.tags.map((t) => ({ value: t.slug, label: t.slug })),
);

// ── Helpers ──
const statusBadgeClass = computed(() => {
  const s = props.book?.status;
  if (s === "PUBLISHED") return "bg-emerald-100 text-emerald-800";
  if (s === "ARCHIVED") return "bg-gray-200 text-gray-600";
  if (s === "DISCONTINUED") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-800";
});

const chapterCount = computed(() => props.book?.chapters?.length ?? 0);

const totalWords = computed(() => {
  if (!props.book?.chapters) return 0;
  return props.book.chapters.reduce(
    (sum: number, ch: any) => sum + (ch.wordCount ?? 0),
    0,
  );
});

// Chapter type options with icons
const chapterTypes = [
  { value: "CHAPTER", label: "Chapter", icon: BookTemplate },
  { value: "PROLOGUE", label: "Prologue", icon: ScrollText },
  { value: "EPILOGUE", label: "Epilogue", icon: BookOpen },
  { value: "BONUS", label: "Bonus", icon: Star },
];

const chapterTypeIcon = computed(() => {
  const found = chapterTypes.find((ct) => ct.value === chapterType.value);
  return found?.icon ?? BookTemplate;
});

// ── Sync from props when drawer opens ──
watch(
  () => props.show,
  (visible) => {
    if (!visible || !props.book) return;
    localTitle.value = props.book.title || "";
    localDescription.value = props.book.description || "";
    localGenreSlug.value = props.book.genreSlug || props.book.genre?.slug || "";
    localCategorySlugs.value =
      props.book.categorySlugs ||
      props.book.categories?.map((c: any) => c.slug) ||
      [];
    localTagSlugs.value =
      props.book.tagSlugs || props.book.tags?.map((t: any) => t.slug) || [];
    localCoverPreview.value = props.book.coverImageUrl || null;

    // Derive pricingModel from existing booleans
    if (props.book.isPremium) {
      pricingModel.value = "premium";
    } else if (props.book.isPurchasable) {
      pricingModel.value = "purchasable";
    } else {
      pricingModel.value = "free";
    }
    localPrice.value = props.book.price ?? 0;

    if (props.selectedChapter) {
      chapterTitle.value = props.selectedChapter.title || "";
      chapterDescription.value = props.selectedChapter.description || "";
      chapterType.value = props.selectedChapter.type || "CHAPTER";
      chapterPrice.value = props.selectedChapter.price ?? 0;
      // Derive pricing model from chapter booleans
      if (props.selectedChapter.isPremium) {
        chapterPricingModel.value = "premium";
      } else if (props.selectedChapter.isPurchasable) {
        chapterPricingModel.value = "purchasable";
      } else {
        chapterPricingModel.value = "default";
      }
    }
  },
);

// ── Emit helpers ──
function emitPricing() {
  emit("savePricing", {
    isFree: pricingModel.value === "free",
    price:
      pricingModel.value === "purchasable" ? Number(localPrice.value) || 0 : 0,
    isPurchasable: pricingModel.value === "purchasable",
    isPremium: pricingModel.value === "premium",
  });
}

function handleCreateGenre(name: string) {
  emit("createGenre", name);
  // Optimistically set the slug
  localGenreSlug.value = name.toLowerCase().replace(/\s+/g, "-");
}

function handleCreateCategory(name: string) {
  emit("createCategory", name);
  // Optimistically add the slug
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  if (!localCategorySlugs.value.includes(slug)) {
    localCategorySlugs.value = [...localCategorySlugs.value, slug];
  }
}

function handleCreateTag(name: string) {
  emit("createTag", name);
  if (!localTagSlugs.value.includes(name)) {
    localTagSlugs.value = [...localTagSlugs.value, name];
  }
}

function onCoverChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    localCoverPreview.value = URL.createObjectURL(file);
    emit("coverFileSelected", file);
  }
}
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > :last-child,
.drawer-leave-to > :last-child {
  transform: translateX(100%);
}
.drawer-enter-active > :last-child,
.drawer-leave-active > :last-child {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #e5e0d8;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #d1c9b8;
}
</style>
