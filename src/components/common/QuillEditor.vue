<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

interface Props {
  content?: string
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  readOnly: false
})

const emit = defineEmits<{
  update: [content: string]
  textChange: [delta: any]
}>()

const editorRef = ref<any>(null)

// Quill toolbar configuration
const toolbarConfig = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['link', 'image', 'video']
]

const quillModules: any = {
  toolbar: toolbarConfig
}

const handleTextChange = (event: any) => {
  const content = editorRef.value?.getHTML() || ''
  emit('update', content)
  emit('textChange', event)
}

const getContent = () => {
  return editorRef.value?.getHTML() || ''
}

const setContent = (html: string) => {
  if (editorRef.value) {
    editorRef.value.setContents(html, 'html')
  }
}

defineExpose({
  getContent,
  setContent,
  editor: editorRef
})
</script>

<template>
  <div class="quill-editor-wrapper">
    <QuillEditor
      ref="editorRef"
      :content="content"
      :modules="quillModules"
      :read-only="readOnly"
      @text-change="handleTextChange"
      content-type="html"
    />
  </div>
</template>

<style scoped>
:deep(.ql-container) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.8;
}

:deep(.ql-editor) {
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
  padding: 2rem;
}

:deep(.ql-toolbar) {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem 0.5rem 0 0;
}

:deep(.ql-container) {
  border: 1px solid #e5e7eb;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: white;
}

:deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: italic;
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
</style>
