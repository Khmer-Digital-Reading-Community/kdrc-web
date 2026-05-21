<script setup lang="ts">
import { watch, onBeforeUnmount } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

interface Props {
    content?: string;
    readOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    content: "",
    readOnly: false,
});

const emit = defineEmits<{
    /** Used by CreateBook.vue: @update="val => description = val" */
    update: [content: string];
    /** Used by WritingPage.vue: v-model:content="editorContent" */
    "update:content": [content: string];
    /** Used by WritingPage.vue: @text-change="handleEditorChange" */
    textChange: [payload: { json: string }];
}>();

const editor = useEditor({
    content: props.content,
    editable: !props.readOnly,
    extensions: [
        StarterKit,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
    ],
    onUpdate({ editor }) {
        const json = JSON.stringify(editor.getJSON());
        emit("update", json);
        emit("update:content", json);
        emit("textChange", { json });
    },
});

// Sync incoming prop changes (e.g. when WritingPage selects a different chapter)
watch(
    () => props.content,
    (incoming) => {
        if (!editor.value || !incoming) return;
        try {
            const json = JSON.parse(incoming);
            editor.value.commands.setContent(json, false);
        } catch {
            // Legacy HTML content
            if (editor.value.getHTML() !== incoming) {
                editor.value.commands.setContent(incoming, false);
            }
        }
    },
);

watch(
    () => props.readOnly,
    (val) => editor.value?.setEditable(!val),
);

onBeforeUnmount(() => editor.value?.destroy());

/** Return the current editor content as a TipTap JSON string. */
const getContent = (): string => {
    if (!editor.value) return "";
    return JSON.stringify(editor.value.getJSON());
};

/** Set editor content from a JSON string (or legacy HTML string). */
const setContent = (raw: string) => {
    if (!editor.value || !raw) return;
    try {
        editor.value.commands.setContent(JSON.parse(raw), false);
    } catch {
        editor.value.commands.setContent(raw, false);
    }
};

// Legacy shims so WritingPage.vue still compiles
const getHTML = () => editor.value?.getHTML() ?? "";
const setHTML = setContent;

defineExpose({ getContent, setContent, getHTML, setHTML, editor });
</script>

<template>
    <div class="tiptap-wrapper">
        <!-- Toolbar — hidden in read-only mode -->
        <div v-if="!readOnly && editor" class="tiptap-toolbar">
            <button
                @mousedown.prevent="editor.chain().focus().toggleBold().run()"
                :class="{ active: editor.isActive('bold') }"
                type="button"
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                @mousedown.prevent="editor.chain().focus().toggleItalic().run()"
                :class="{ active: editor.isActive('italic') }"
                type="button"
                title="Italic"
            >
                <em>I</em>
            </button>
            <button
                @mousedown.prevent="editor.chain().focus().toggleStrike().run()"
                :class="{ active: editor.isActive('strike') }"
                type="button"
                title="Strike"
            >
                <s>S</s>
            </button>
            <span class="sep" />
            <button
                @mousedown.prevent="
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                "
                :class="{ active: editor.isActive('heading', { level: 1 }) }"
                type="button"
            >
                H1
            </button>
            <button
                @mousedown.prevent="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
                :class="{ active: editor.isActive('heading', { level: 2 }) }"
                type="button"
            >
                H2
            </button>
            <button
                @mousedown.prevent="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                "
                :class="{ active: editor.isActive('heading', { level: 3 }) }"
                type="button"
            >
                H3
            </button>
            <span class="sep" />
            <button
                @mousedown.prevent="
                    editor.chain().focus().toggleBulletList().run()
                "
                :class="{ active: editor.isActive('bulletList') }"
                type="button"
                title="Bullet list"
            >
                •
            </button>
            <button
                @mousedown.prevent="
                    editor.chain().focus().toggleOrderedList().run()
                "
                :class="{ active: editor.isActive('orderedList') }"
                type="button"
                title="Ordered list"
            >
                1.
            </button>
            <button
                @mousedown.prevent="
                    editor.chain().focus().toggleBlockquote().run()
                "
                :class="{ active: editor.isActive('blockquote') }"
                type="button"
                title="Blockquote"
            >
                "
            </button>
            <button
                @mousedown.prevent="
                    editor.chain().focus().toggleCodeBlock().run()
                "
                :class="{ active: editor.isActive('codeBlock') }"
                type="button"
                title="Code block"
            >
                {}
            </button>
            <span class="sep" />
            <button
                @mousedown.prevent="
                    editor.chain().focus().setTextAlign('left').run()
                "
                :class="{ active: editor.isActive({ textAlign: 'left' }) }"
                type="button"
                title="Align left"
            >
                ⬛
            </button>
            <button
                @mousedown.prevent="
                    editor.chain().focus().setTextAlign('center').run()
                "
                :class="{ active: editor.isActive({ textAlign: 'center' }) }"
                type="button"
                title="Align center"
            >
                ⬛
            </button>
            <button
                @mousedown.prevent="
                    editor.chain().focus().setTextAlign('right').run()
                "
                :class="{ active: editor.isActive({ textAlign: 'right' }) }"
                type="button"
                title="Align right"
            >
                ⬛
            </button>
            <span class="sep" />
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
            <span class="sep" />
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

        <EditorContent :editor="editor" />
    </div>
</template>

<style scoped>
.tiptap-wrapper {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
}

.tiptap-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    padding: 6px 8px;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.tiptap-toolbar button {
    padding: 3px 8px;
    min-width: 28px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: none;
    cursor: pointer;
    font-size: 13px;
    color: #374151;
    line-height: 1.4;
    transition:
        background 0.12s,
        border-color 0.12s;
}
.tiptap-toolbar button:hover {
    background: #e5e7eb;
}
.tiptap-toolbar button.active {
    background: #d1fae5;
    border-color: #6ee7b7;
    color: #065f46;
}

.sep {
    width: 1px;
    height: 20px;
    background: #e5e7eb;
    margin: 0 4px;
    flex-shrink: 0;
    align-self: center;
}

:deep(.ProseMirror) {
    min-height: 300px;
    max-height: 400px;
    overflow-y: auto;
    padding: 1.5rem 2rem;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
        Arial, sans-serif;
    font-size: 14px;
    line-height: 1.8;
    color: #1f2937;
    outline: none;
}

:deep(.ProseMirror h1) {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 1rem 0 0.5rem;
}
:deep(.ProseMirror h2) {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0.8rem 0 0.4rem;
}
:deep(.ProseMirror h3) {
    font-size: 1.15rem;
    font-weight: 600;
    margin: 0.6rem 0 0.3rem;
}
:deep(.ProseMirror p) {
    margin: 0 0 0.5rem;
}
:deep(.ProseMirror ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
}
:deep(.ProseMirror ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
}
:deep(.ProseMirror li) {
    margin-bottom: 0.25rem;
}
:deep(.ProseMirror blockquote) {
    border-left: 3px solid #d1d5db;
    padding-left: 1rem;
    color: #6b7280;
    font-style: italic;
    margin: 0.5rem 0;
}
:deep(.ProseMirror code) {
    background: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: "Courier New", monospace;
}
:deep(.ProseMirror pre) {
    background: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.5rem 0;
}
:deep(.ProseMirror pre code) {
    background: none;
    color: inherit;
    padding: 0;
}
:deep(.ProseMirror mark) {
    background: #fef08a;
}
:deep(.ProseMirror strong) {
    font-weight: 700;
}
:deep(.ProseMirror em) {
    font-style: italic;
}
:deep(.ProseMirror s) {
    text-decoration: line-through;
}
</style>
