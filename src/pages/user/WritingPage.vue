<script setup lang="ts">
import { ref, computed } from 'vue'
// @ts-ignore
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import WritingNavbar from '../../components/common/WritingNavbar.vue'
import WritingSidebar from '../../components/common/WritingSidebar.vue'
import { Clock } from 'lucide-vue-next'

interface Chapter {
  id: string
  title: string
  status: 'draft' | 'published'
  wordCount: number
}

interface BookMetadata {
  title: string
  genre: string
  language: string
  tags: string[]
  readyToPublish: boolean
  lastUpdated: string
  wordCount: number
}

// Quill editor configuration for book writing
const toolbarConfig = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': [1, 2, 3, false] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['link', 'image', 'video']
]

const quillModules: any = {
  toolbar: toolbarConfig
}

const editorRef = ref<any>(null)
const editorContent = ref(`<p>Here is the Khmer text placeholder.</p>

<p>The sun hung low in the horizon, casting long, amber shadows across the loom. Arun's fingers moved with a rhythmic grace, a dance perfected over decades of solitary labor. Every thread was a memory, every knot a promise kept to the earth that provided the silk.</p>

<p>It wasn't just a garment he was weaving; it was a map of the spirit. The villagers called him the Weaver of Echoes, for they said his patterns could sing if one listened closely enough during the monsoon rains.</p>`)

const activeChapterId = ref('1')
const isSaved = ref(true)
const lastSavedTime = ref('2 mins ago')
const isEditingTitle = ref(false)
const titleInput = ref('Untitled Masterpiece')

const chapters: Chapter[] = [
  { id: '1', title: 'Introduction', status: 'draft', wordCount: 0 },
  { id: '2', title: 'Chapter 1: The Beginning', status: 'draft', wordCount: 1200 },
  { id: '3', title: 'Chapter 2: Rising Action', status: 'draft', wordCount: 850 },
  { id: '4', title: 'Chapter 3: The Climax', status: 'draft', wordCount: 0 }
]

const bookMetadata = ref<BookMetadata>({
  title: titleInput.value,
  genre: 'your name',
  language: 'English (EN)',
  tags: ['Funny', 'Drama'],
  readyToPublish: true,
  lastUpdated: lastSavedTime.value,
  wordCount: 1420
})

// Calculate word count from editor content
const wordCount = computed(() => {
  if (!editorRef.value) return 0
  // Get plain text from HTML content
  const div = document.createElement('div')
  div.innerHTML = editorContent.value
  const text = div.textContent || ''
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
})

// Handle content updates
const handleEditorChange = () => {
  if (editorRef.value) {
    editorContent.value = editorRef.value.getHTML()
    isSaved.value = false
  }
}

const handleSelectChapter = (chapterId: string) => {
  activeChapterId.value = chapterId
  // Load chapter content here
}

const handleNewChapter = () => {
  console.log('Create new chapter')
}

const handleTitleChange = () => {
  bookMetadata.value.title = titleInput.value
  isSaved.value = false
  isEditingTitle.value = false
}

const startEditingTitle = () => {
  isEditingTitle.value = true
}

const cancelEditingTitle = () => {
  titleInput.value = bookMetadata.value.title
  isEditingTitle.value = false
}

const handleSaveDraft = () => {
  // Save all the data
  bookMetadata.value.title = titleInput.value
  bookMetadata.value.wordCount = wordCount.value || bookMetadata.value.wordCount

  isSaved.value = true
  lastSavedTime.value = 'just now'
  bookMetadata.value.lastUpdated = lastSavedTime.value
  console.log('Draft saved:', {
    title: bookMetadata.value.title,
    genre: bookMetadata.value.genre,
    language: bookMetadata.value.language,
    tags: bookMetadata.value.tags,
    wordCount: bookMetadata.value.wordCount,
    content: editorContent.value.substring(0, 100) + '...'
  })
}

const handlePublish = () => {
  // Save before publishing
  handleSaveDraft()
  console.log('Publishing book:', bookMetadata.value.title)
}

const removeTag = (index: number) => {
  bookMetadata.value.tags.splice(index, 1)
}

const uploadCover = () => {
  console.log('Upload cover clicked')
}
</script>

<template>
  <div class="flex flex-col h-screen bg-[#F5E6D3]">
    <!-- Writing Navbar -->
    <WritingNavbar
      @saveDraft="handleSaveDraft"
      @publish="handlePublish"
    />

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <WritingSidebar
        :chapters="chapters"
        :activeChapterId="activeChapterId"
        @selectChapter="handleSelectChapter"
        @newChapter="handleNewChapter"
      />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto px-12 py-8">
          <!-- Header Section with Cover and Metadata -->
          <div class="mb-8 flex gap-8">
            <!-- Cover Upload Section -->
            <button
              @click="uploadCover"
              class="flex-shrink-0 group relative"
            >
              <div class="w-48 h-64 bg-gray-300 rounded border-4 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 opacity-50"></div>
                <div class="relative z-10 text-center">
                  <div class="mb-3">
                    <svg class="w-12 h-12 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                  <p class="text-sm font-medium text-gray-700">Upload Book</p>
                  <p class="text-sm text-gray-600">Cover</p>
                  <p class="text-xs text-gray-500 mt-2 font-medium">RECOMMENDED:</p>
                  <p class="text-xs text-gray-500">1600x2400px</p>
                </div>
              </div>
            </button>

            <!-- Title and Metadata Section -->
            <div class="flex-1">
            <!-- Title - Editable -->
              <div class="mb-8">
                <!-- Display Mode -->
                <div v-if="!isEditingTitle" @click="startEditingTitle" class="group cursor-pointer">
                  <h1 class="text-5xl font-light text-gray-300 leading-tight group-hover:text-gray-400 transition-colors">
                    {{ bookMetadata.title }}
                  </h1>
                  <p class="text-xs text-gray-500 mt-2 group-hover:text-gray-600 transition-colors">Click to edit title</p>
                </div>

                <!-- Edit Mode -->
                <div v-else class="mb-4">
                  <input
                    v-model="titleInput"
                    type="text"
                    @keyup.enter="handleTitleChange"
                    @keyup.escape="cancelEditingTitle"
                    class="w-full text-5xl font-light bg-white border-b-2 border-amber-600 focus:outline-none focus:border-amber-700 text-gray-900 pb-2"
                    placeholder="Enter book title"
                    autofocus
                  />
                  <div class="flex gap-2 mt-4">
                    <button
                      @click="handleTitleChange"
                      class="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded hover:bg-amber-700 transition-colors"
                    >
                      Save Title
                    </button>
                    <button
                      @click="cancelEditingTitle"
                      class="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <!-- Metadata Grid -->
              <div class="grid grid-cols-2 gap-8 mb-6">
                <!-- Genre -->
                <div>
                  <label class="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2 block">Genre</label>
                  <input
                    v-model="bookMetadata.genre"
                    type="text"
                    placeholder="your name"
                    class="w-full px-0 py-1 border-b border-gray-300 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <!-- Language -->
                <div>
                  <label class="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2 block">Project Language</label>
                  <div class="flex gap-4">
                    <button
                      class="px-0 py-1 border-b-2 text-sm font-semibold transition-colors"
                      :class="bookMetadata.language === 'English (EN)' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
                      @click="bookMetadata.language = 'English (EN)'"
                    >
                      English (EN)
                    </button>
                    <button
                      class="px-0 py-1 border-b-2 text-sm font-semibold transition-colors"
                      :class="bookMetadata.language === 'Khmer (KH)' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
                      @click="bookMetadata.language = 'Khmer (KH)'"
                    >
                      Khmer (KH)
                    </button>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div class="mb-6">
                <label class="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3 block">Tags</label>
                <div class="flex gap-2 flex-wrap">
                  <span
                    v-for="(tag, index) in bookMetadata.tags"
                    :key="index"
                    class="bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-amber-300 transition-colors"
                  >
                    {{ tag }}
                    <button @click="removeTag(index)" class="ml-1 font-bold hover:opacity-70">×</button>
                  </span>
                </div>
              </div>

              <!-- Status Line -->
              <div class="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-300">
                <div class="flex items-center gap-1">
                  <Clock :size="16" class="text-gray-500" />
                  <span>Last saved {{ bookMetadata.lastUpdated }}</span>
                </div>
                <span>•</span>
                <span>{{ wordCount || bookMetadata.wordCount }} words</span>
                <span>•</span>
                <span v-if="bookMetadata.readyToPublish" class="text-amber-700 font-semibold">Ready to Publish</span>
              </div>
            </div>
          </div>

          <!-- Quill Editor -->
          <div class="mb-4">
            <QuillEditor
              ref="editorRef"
              v-model:content="editorContent"
              :options="{ modules: quillModules }"
              content-type="html"
              @text-change="handleEditorChange"
              class="quill-editor-container"
            />
          </div>

          <!-- Footer spacing -->
          <div class="mt-8"></div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-[#093A3F] text-[#FDE9D0]/70 text-xs px-8 py-4 border-t border-gray-700 flex justify-between">
      <span>© 2025 THE DIGITAL ATELIER. ALL RIGHTS RESERVED.</span>
      <div class="flex gap-6">
        <a href="#" class="hover:text-[#FDE9D0]">EPISODIC NOTES</a>
        <a href="#" class="hover:text-[#FDE9D0]">WRITING GUIDELINES</a>
        <a href="#" class="hover:text-[#FDE9D0]">SUPPORT</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
:deep(.ql-container) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  border-radius: 0.5rem;
}

:deep(.ql-editor) {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
  padding: 2rem;
  background-color: white;
}

:deep(.ql-toolbar) {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 1rem;
}

:deep(.ql-container) {
  border: 1px solid #e5e7eb;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: white;
}

:deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: italic;
  font-size: 1rem;
}

:deep(.ql-snow .ql-stroke) {
  stroke: #6b7280;
}

:deep(.ql-snow .ql-fill) {
  fill: #6b7280;
}

:deep(.ql-snow .ql-picker-label) {
  color: #6b7280;
}

:deep(.ql-toolbar.ql-snow button:hover),
:deep(.ql-toolbar.ql-snow button:focus),
:deep(.ql-toolbar.ql-snow button.ql-active),
:deep(.ql-toolbar.ql-snow .ql-picker-label:hover),
:deep(.ql-toolbar.ql-snow .ql-picker-item:hover),
:deep(.ql-toolbar.ql-snow .ql-picker-item.ql-selected) {
  color: #d97706;
}

:deep(.ql-toolbar.ql-snow button:hover .ql-stroke),
:deep(.ql-toolbar.ql-snow button:focus .ql-stroke),
:deep(.ql-toolbar.ql-snow button.ql-active .ql-stroke),
:deep(.ql-toolbar.ql-snow .ql-picker-label:hover .ql-stroke),
:deep(.ql-toolbar.ql-snow .ql-picker-item:hover .ql-stroke),
:deep(.ql-toolbar.ql-snow .ql-picker-item.ql-selected .ql-stroke) {
  stroke: #d97706;
}

:deep(.ql-toolbar.ql-snow button:hover .ql-fill),
:deep(.ql-toolbar.ql-snow button:focus .ql-fill),
:deep(.ql-toolbar.ql-snow button.ql-active .ql-fill),
:deep(.ql-toolbar.ql-snow .ql-picker-label:hover .ql-fill),
:deep(.ql-toolbar.ql-snow .ql-picker-item:hover .ql-fill),
:deep(.ql-toolbar.ql-snow .ql-picker-item.ql-selected .ql-fill),
:deep(.ql-toolbar.ql-snow .ql-picker-item.ql-selected .ql-picker-label) {
  fill: #d97706;
}

:deep(.ql-editor h1),
:deep(.ql-editor h2),
:deep(.ql-editor h3) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

:deep(.ql-editor h1) {
  font-size: 2rem;
  font-weight: 600;
}

:deep(.ql-editor h2) {
  font-size: 1.5rem;
  font-weight: 600;
}

:deep(.ql-editor h3) {
  font-size: 1.25rem;
  font-weight: 600;
}

:deep(.ql-editor blockquote) {
  border-left: 4px solid #d97706;
  margin: 1rem 0;
  padding-left: 1rem;
  color: #666;
}

:deep(.ql-editor code) {
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

:deep(.ql-editor pre) {
  background-color: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

:deep(.ql-editor pre code) {
  background-color: transparent;
  color: inherit;
  padding: 0;
}

:deep(.ql-editor ul),
:deep(.ql-editor ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

:deep(.ql-editor li) {
  margin-bottom: 0.5rem;
}
</style>
