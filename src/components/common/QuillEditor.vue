<script setup lang="ts">
import { watch, onBeforeUnmount, ref } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-vue-next";

interface Props {
  content?: string;
  readOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  readOnly: false,
});

const emit = defineEmits<{
  update: [content: string];
  "update:content": [content: string];
  textChange: [payload: { json: string }];
}>();

const fileInputRef = ref<HTMLInputElement>();
const linkUrl = ref("");
const showLinkInput = ref(false);

const editor = useEditor({
  content: props.content,
  editable: !props.readOnly,
  extensions: [
    StarterKit,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: "editor-image",
      },
    }),
    Underline,
    Superscript,
    Subscript,
    HorizontalRule,
  ],
  onUpdate({ editor }) {
    const json = JSON.stringify(editor.getJSON());
    emit("update", json);
    emit("update:content", json);
    emit("textChange", { json });
  },
});

watch(
  () => props.content,
  (incoming) => {
    if (!editor.value || !incoming) return;
    try {
      const json = JSON.parse(incoming);
      editor.value.commands.setContent(json, { emitUpdate: false });
    } catch {
      if (editor.value.getHTML() !== incoming) {
        editor.value.commands.setContent(incoming, { emitUpdate: false });
      }
    }
  },
);

watch(
  () => props.readOnly,
  (val) => editor.value?.setEditable(!val),
);

onBeforeUnmount(() => editor.value?.destroy());

const getContent = (): string => {
  if (!editor.value) return "";
  return JSON.stringify(editor.value.getJSON());
};

const setContent = (raw: string) => {
  if (!editor.value || !raw) return;
  try {
    editor.value.commands.setContent(JSON.parse(raw), { emitUpdate: false });
  } catch {
    editor.value.commands.setContent(raw, { emitUpdate: false });
  }
};

const insertImage = () => {
  fileInputRef.value?.click();
};

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const url = event.target?.result as string;
    editor.value?.chain().focus().setImage({ src: url }).run();
  };
  reader.readAsDataURL(file);

  // Reset input
  (e.target as HTMLInputElement).value = "";
};

const setLink = () => {
  if (!linkUrl.value.trim()) return;

  if (linkUrl.value) {
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl.value })
      .run();
  }

  linkUrl.value = "";
  showLinkInput.value = false;
};

const removeLink = () => {
  editor.value?.chain().focus().unsetLink().run();
  showLinkInput.value = false;
};

defineExpose({
  getContent,
  setContent,
  getHTML: () => editor.value?.getHTML() ?? "",
  setHTML: setContent,
  editor,
});
</script>

<template>
  <div class="tiptap-wrapper">
    <!-- Toolbar -->
    <div v-if="!readOnly && editor" class="tiptap-toolbar">
      <!-- Text Formatting -->
      <div class="toolbar-group">
        <button
          @mousedown.prevent="editor.chain().focus().toggleBold().run()"
          :class="{ active: editor.isActive('bold') }"
          type="button"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          @mousedown.prevent="editor.chain().focus().toggleItalic().run()"
          :class="{ active: editor.isActive('italic') }"
          type="button"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          @mousedown.prevent="editor.chain().focus().toggleUnderline().run()"
          :class="{ active: editor.isActive('underline') }"
          type="button"
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          @mousedown.prevent="editor.chain().focus().toggleStrike().run()"
          :class="{ active: editor.isActive('strike') }"
          type="button"
          title="Strikethrough"
        >
          <s>S</s>
        </button>
      </div>

      <span class="sep" />

      <!-- Headings -->
      <div class="toolbar-group">
        <button
          @mousedown.prevent="
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          "
          :class="{ active: editor.isActive('heading', { level: 1 }) }"
          type="button"
          title="Heading 1"
        >
          H1
        </button>
        <button
          @mousedown.prevent="
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          "
          :class="{ active: editor.isActive('heading', { level: 2 }) }"
          type="button"
          title="Heading 2"
        >
          H2
        </button>
        <button
          @mousedown.prevent="
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          "
          :class="{ active: editor.isActive('heading', { level: 3 }) }"
          type="button"
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <span class="sep" />

      <!-- Lists & Quotes -->
      <div class="toolbar-group">
        <button
          @mousedown.prevent="editor.chain().focus().toggleBulletList().run()"
          :class="{ active: editor.isActive('bulletList') }"
          type="button"
          title="Bullet list"
        >
          •
        </button>
        <button
          @mousedown.prevent="editor.chain().focus().toggleOrderedList().run()"
          :class="{ active: editor.isActive('orderedList') }"
          type="button"
          title="Ordered list"
        >
          1.
        </button>
        <button
          @mousedown.prevent="editor.chain().focus().toggleBlockquote().run()"
          :class="{ active: editor.isActive('blockquote') }"
          type="button"
          title="Blockquote"
        >
          "
        </button>
        <button
          @mousedown.prevent="editor.chain().focus().setHorizontalRule().run()"
          type="button"
          title="Horizontal line"
        >
          <Minus :size="16" class="inline" />
        </button>
      </div>

      <span class="sep" />

      <!-- Code & Script -->
      <div class="toolbar-group">
        <button
          @mousedown.prevent="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ active: editor.isActive('codeBlock') }"
          type="button"
          title="Code block"
        >
          {}
        </button>
        <button
          @mousedown.prevent="editor.chain().focus().toggleSuperscript().run()"
          :class="{ active: editor.isActive('superscript') }"
          type="button"
          title="Superscript"
        >
          <ArrowUp :size="14" class="inline" />
        </button>
        <button
          @mousedown.prevent="editor.chain().focus().toggleSubscript().run()"
          :class="{ active: editor.isActive('subscript') }"
          type="button"
          title="Subscript"
        >
          <ArrowDown :size="14" class="inline" />
        </button>
      </div>

      <span class="sep" />

      <!-- Media & Links -->
      <div class="toolbar-group">
        <button
          @mousedown.prevent="insertImage"
          type="button"
          title="Insert image"
          class="image-btn"
        >
          <ImageIcon :size="16" class="inline" />
        </button>
        <button
          @mousedown.prevent="showLinkInput = !showLinkInput"
          :class="{ active: editor.isActive('link') }"
          type="button"
          title="Insert/edit link"
        >
          <LinkIcon :size="16" class="inline" />
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleImageUpload"
        />
      </div>

      <span class="sep" />

      <!-- Alignment -->
      <div class="toolbar-group">
        <button
          @mousedown.prevent="editor.chain().focus().setTextAlign('left').run()"
          :class="{ active: editor.isActive({ textAlign: 'left' }) }"
          type="button"
          title="Align left"
        >
          ⬅
        </button>
        <button
          @mousedown.prevent="
            editor.chain().focus().setTextAlign('center').run()
          "
          :class="{ active: editor.isActive({ textAlign: 'center' }) }"
          type="button"
          title="Align center"
        >
          ⬆
        </button>
        <button
          @mousedown.prevent="
            editor.chain().focus().setTextAlign('right').run()
          "
          :class="{ active: editor.isActive({ textAlign: 'right' }) }"
          type="button"
          title="Align right"
        >
          ➡
        </button>
      </div>

      <span class="sep" />

      <!-- Undo/Redo & Clear -->
      <div class="toolbar-group">
        <button
          @mousedown.prevent="editor.chain().focus().undo().run()"
          type="button"
          title="Undo"
        >
          ↩
        </button>
        <button
          @mousedown.prevent="editor.chain().focus().redo().run()"
          type="button"
          title="Redo"
        >
          ↪
        </button>
        <button
          @mousedown.prevent="
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          "
          type="button"
          title="Clear formatting"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Link Input Row -->
    <div v-if="!readOnly && editor && showLinkInput" class="link-input-row">
      <input
        v-model="linkUrl"
        type="url"
        placeholder="https://example.com"
        @keyup.enter="setLink"
        @keyup.escape="showLinkInput = false"
        class="link-input"
        autofocus
      />
      <button
        @mousedown.prevent="setLink"
        class="link-btn link-btn-add"
        title="Add link"
      >
        Add
      </button>
      <button
        v-if="editor.isActive('link')"
        @mousedown.prevent="removeLink"
        class="link-btn link-btn-remove"
        title="Remove link"
      >
        Remove
      </button>
      <button
        @mousedown.prevent="showLinkInput = false"
        class="link-btn link-btn-cancel"
        title="Cancel"
      >
        Cancel
      </button>
    </div>

    <EditorContent :editor="editor" />
  </div>
</template>

<style scoped>
.tiptap-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tiptap-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
  padding: 8px;
  background: linear-gradient(to bottom, #fafbfc, #f3f4f6);
  border-bottom: 1px solid #e5e7eb;
}

.toolbar-group {
  display: flex;
  gap: 2px;
}

.tiptap-toolbar button {
  padding: 4px 8px;
  min-width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
  font-weight: 500;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tiptap-toolbar button:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
  color: #1f2937;
}

.tiptap-toolbar button.active {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #047857;
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.tiptap-toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sep {
  width: 1px;
  height: 24px;
  background: #d1d5db;
  margin: 0 4px;
  flex-shrink: 0;
  align-self: center;
}

.link-input-row {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: #f0fdf4;
  border-bottom: 1px solid #bbf7d0;
  align-items: center;
}

.link-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #86efac;
  border-radius: 4px;
  font-size: 12px;
  background: white;
}

.link-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.link-btn {
  padding: 4px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.link-btn-add {
  background: #10b981;
  color: white;
  border-color: #059669;
}

.link-btn-add:hover {
  background: #059669;
}

.link-btn-remove {
  background: #ef4444;
  color: white;
  border-color: #dc2626;
}

.link-btn-remove:hover {
  background: #dc2626;
}

.link-btn-cancel {
  background: #f3f4f6;
  color: #6b7280;
  border-color: #d1d5db;
}

.link-btn-cancel:hover {
  background: #e5e7eb;
}

:deep(.ProseMirror) {
  min-height: 350px;
  max-height: 500px;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  font-size: 15px;
  line-height: 1.8;
  color: #1f2937;
  outline: none;
}

:deep(.ProseMirror h1) {
  font-size: 1.875rem;
  font-weight: 800;
  margin: 1.5rem 0 0.75rem;
  color: #111827;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.25rem 0 0.75rem;
  color: #111827;
}

:deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: #374151;
}

:deep(.ProseMirror p) {
  margin: 0 0 0.75rem;
}

:deep(.ProseMirror ul) {
  list-style-type: disc;
  padding-left: 2rem;
  margin-bottom: 0.75rem;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
  padding-left: 2rem;
  margin-bottom: 0.75rem;
}

:deep(.ProseMirror li) {
  margin-bottom: 0.35rem;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid #f59e0b;
  padding-left: 1.25rem;
  color: #92400e;
  font-style: italic;
  background: #fefce8;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

:deep(.ProseMirror code) {
  background: #f3f4f6;
  padding: 0.25em 0.5em;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: "Monaco", "Courier New", monospace;
  color: #dc2626;
}

:deep(.ProseMirror pre) {
  background: #1f2937;
  color: #f3f4f6;
  padding: 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid #374151;
}

:deep(.ProseMirror pre code) {
  background: none;
  color: inherit;
  padding: 0;
  font-size: inherit;
}

:deep(.editor-image) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 0.75rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.ProseMirror a) {
  color: #0891b2;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.15s;
}

:deep(.ProseMirror a:hover) {
  color: #0369a1;
}

:deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 1.5rem 0;
}

:deep(.ProseMirror mark) {
  background: #fef3c7;
  padding: 0.1em 0.2em;
  border-radius: 2px;
}

:deep(.ProseMirror strong) {
  font-weight: 700;
}

:deep(.ProseMirror em) {
  font-style: italic;
}

:deep(.ProseMirror s) {
  text-decoration: line-through;
  color: #9ca3af;
}

:deep(.ProseMirror u) {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}

:deep(.ProseMirror sup) {
  font-size: 0.75em;
  vertical-align: super;
}

:deep(.ProseMirror sub) {
  font-size: 0.75em;
  vertical-align: sub;
}
</style>
