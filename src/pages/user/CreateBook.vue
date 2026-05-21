<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";
import QuillEditor from "@/components/common/QuillEditor.vue";
import CoverImageUploader from "@/components/common/CoverImageUploader.vue";
import { createBook, uploadBookCover } from "@/services/bookApi";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const title = ref("");
const description = ref("");
const coverPreviewUrl = ref<string | null>(null);
const coverImageUrl = ref<string | null>(null);
const coverUploadError = ref<string | null>(null);
const isSubmitting = ref(false);
const isUploadingCover = ref(false);
const formError = ref<string | null>(null);

const handleCoverSelected = async (file: File) => {
    coverUploadError.value = null;
    isUploadingCover.value = true;

    try {
        const previewUrl = URL.createObjectURL(file);
        coverPreviewUrl.value = previewUrl;

        const response = await uploadBookCover(file);
        coverImageUrl.value = response.url;
        toast.success("Cover uploaded");
    } catch (error) {
        coverUploadError.value = "Failed to upload cover. Please try again.";
        toast.error(coverUploadError.value);
    } finally {
        isUploadingCover.value = false;
    }
};

const clearCover = () => {
    coverPreviewUrl.value = null;
    coverImageUrl.value = null;
    coverUploadError.value = null;
};

const validateForm = () => {
    if (!title.value.trim()) {
        formError.value = "Title is required.";
        return false;
    }

    if (!description.value.trim()) {
        formError.value = "Description is required.";
        return false;
    }

    formError.value = null;
    return true;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    isSubmitting.value = true;
    try {
        const book = await createBook({
            title: title.value.trim(),
            content: description.value.trim(),
            coverImageUrl: coverImageUrl.value || undefined,
        });

        toast.success("Book created successfully!");
        router.push(`/${book.id}/write`);
    } catch (error) {
        formError.value = "Failed to create book. Please try again.";
        toast.error(formError.value);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-[#F6F1E8]">
        <Sidebar />

        <div class="flex-1 flex flex-col overflow-hidden">
            <div class="sticky top-0 z-30">
                <Navbar />
            </div>

            <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div class="max-w-5xl mx-auto">
                    <div class="mb-6">
                        <p
                            class="text-xs uppercase tracking-[0.2em] text-gray-400"
                        >
                            Atelier
                        </p>
                        <h1 class="text-3xl font-semibold text-[#123C3A] mt-2">
                            Create Book
                        </h1>
                        <p class="text-sm text-gray-500 mt-1">
                            Start with a strong title and a short description to
                            guide your readers.
                        </p>
                    </div>

                    <div
                        class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6"
                    >
                        <div class="bg-white rounded-3xl p-6 shadow-sm">
                            <label
                                class="block text-sm font-semibold text-[#123C3A] mb-2"
                                >Title</label
                            >
                            <input
                                v-model="title"
                                type="text"
                                placeholder="Enter book title"
                                class="w-full rounded-xl border border-amber-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            />

                            <div class="mt-6">
                                <label
                                    class="block text-sm font-semibold text-[#123C3A] mb-2"
                                    >Description</label
                                >
                                <QuillEditor
                                    :content="description"
                                    @update="(value) => (description = value)"
                                />
                            </div>

                            <div
                                v-if="formError"
                                class="mt-4 text-sm text-red-600"
                            >
                                {{ formError }}
                            </div>

                            <div class="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    @click="handleSubmit"
                                    :disabled="isSubmitting || isUploadingCover"
                                    class="px-5 py-2.5 rounded-xl bg-amber-700 text-white text-sm font-semibold hover:bg-amber-800 transition disabled:opacity-60"
                                >
                                    {{
                                        isSubmitting
                                            ? "Creating..."
                                            : "Create Book"
                                    }}
                                </button>
                                <button
                                    type="button"
                                    @click="
                                        router.push('/dashboard/manuscripts')
                                    "
                                    class="px-5 py-2.5 rounded-xl border border-amber-200 text-amber-800 text-sm font-semibold hover:bg-amber-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div class="bg-white rounded-3xl p-6 shadow-sm">
                            <CoverImageUploader
                                :model-value="coverPreviewUrl"
                                :error="coverUploadError"
                                helper-text="JPG or PNG up to 2MB"
                                @fileSelected="handleCoverSelected"
                                @clear="clearCover"
                            />

                            <p
                                v-if="isUploadingCover"
                                class="text-xs text-amber-700 mt-3"
                            >
                                Uploading cover...
                            </p>
                            <p class="text-xs text-gray-500 mt-3">
                                A strong cover helps your book stand out in the
                                library.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
