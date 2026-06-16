import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  createBook,
  uploadBookCover,
  getGenres,
  getCategories,
  getTags,
  createGenre,
  createCategory,
  createTag,
  type Genre,
  type Category,
  type Tag,
} from "../services/bookApi";
import { useToast } from "vue-toastification";

export type ContentType = "Novel" | "Novella" | "Short Story" | "Poem Collection" | "Educational" | "Other";
export type WizardStep = 1 | 2;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useBookWizard() {
  const router = useRouter();
  const toast = useToast();

  const currentStep = ref<WizardStep>(1);
  const contentType = ref<ContentType | null>(null);
  const contentDescription = ref("");

  const title = ref("");
  const subtitle = ref("");
  const selectedGenre = ref<string>("");
  const selectedCategories = ref<string[]>([]);
  const selectedTags = ref<string[]>([]);

  const coverFile = ref<File | null>(null);
  const coverPreviewUrl = ref<string | null>(null);
  const isUploadingCover = ref(false);
  const isSubmitting = ref(false);

  const genres = ref<Genre[]>([]);
  const categories = ref<Category[]>([]);
  const tags = ref<Tag[]>([]);
  const isLoadingDropdowns = ref(false);
  const dropdownsError = ref<string | null>(null);

  const canGoNext = computed(() => {
    if (currentStep.value === 1) return contentType.value !== null;
    return title.value.trim().length > 0;
  });

  const stepTitles: Record<WizardStep, string> = {
    1: "Content & Classification",
    2: "Book Details",
  };

  onMounted(async () => {
    isLoadingDropdowns.value = true;
    try {
      const [g, c, t] = await Promise.all([
        getGenres(),
        getCategories(),
        getTags(),
      ]);
      genres.value = g;
      categories.value = c;
      tags.value = t;
    } catch {
      dropdownsError.value = "Failed to load form data. Please refresh.";
    } finally {
      isLoadingDropdowns.value = false;
    }
  });

  function goNext() {
    if (canGoNext.value && currentStep.value < 2) {
      currentStep.value = (currentStep.value + 1) as WizardStep;
    }
  }

  function goBack() {
    if (currentStep.value > 1) {
      currentStep.value = (currentStep.value - 1) as WizardStep;
    }
  }

  async function createGenreAction(name: string): Promise<Genre | null> {
    try {
      const slug = slugify(name);
      const genre = await createGenre({ name: name.trim(), slug });
      genres.value = [...genres.value, genre];
      selectedGenre.value = genre.slug;
      toast.success(`Genre "${genre.name}" created`);
      return genre;
    } catch {
      toast.error("Failed to create genre");
      return null;
    }
  }

  async function createCategoryAction(name: string): Promise<Category | null> {
    try {
      const category = await createCategory(name.trim());
      categories.value = [...categories.value, category];
      selectedCategories.value = [...selectedCategories.value, category.slug];
      toast.success(`Category "${category.name}" created`);
      return category;
    } catch {
      toast.error("Failed to create category");
      return null;
    }
  }

  async function createTagAction(name: string): Promise<Tag | null> {
    try {
      const slug = slugify(name);
      const tag = await createTag({ name: name.trim(), slug });
      tags.value = [...tags.value, tag];
      selectedTags.value = [...selectedTags.value, tag.slug];
      toast.success(`Tag "${tag.name}" created`);
      return tag;
    } catch {
      toast.error("Failed to create tag");
      return null;
    }
  }

  function handleCoverSelected(file: File) {
    coverFile.value = file;
    coverPreviewUrl.value = URL.createObjectURL(file);
  }

  function handleCoverClear() {
    coverFile.value = null;
    coverPreviewUrl.value = null;
  }

  async function uploadCoverAndCreateBook(): Promise<string | null> {
    isSubmitting.value = true;
    try {
      let coverUrl: string | undefined;
      if (coverFile.value) {
        isUploadingCover.value = true;
        const result = await uploadBookCover(coverFile.value);
        coverUrl = result.url;
        isUploadingCover.value = false;
      }

      const book = await createBook({
        title: title.value.trim(),
        description: contentDescription.value || undefined,
        coverImageUrl: coverUrl,
        genreSlug: selectedGenre.value || undefined,
        categorySlugs: selectedCategories.value,
        tagSlugs: selectedTags.value,
      });

      toast.success("Book created!");
      router.push(`/${book.id}/write`);
      return book.id;
    } catch {
      toast.error("Failed to create book. Please try again.");
      return null;
    } finally {
      isSubmitting.value = false;
      isUploadingCover.value = false;
    }
  }

  async function skipAndCreateMinimal(): Promise<string | null> {
    isSubmitting.value = true;
    try {
      const book = await createBook({
        title: "Untitled",
        description: "",
      });
      toast.success("Book created!");
      router.push(`/${book.id}/write`);
      return book.id;
    } catch {
      toast.error("Failed to create book.");
      return null;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    currentStep,
    contentType,
    contentDescription,
    title,
    subtitle,
    selectedGenre,
    selectedCategories,
    selectedTags,
    coverFile,
    coverPreviewUrl,
    isUploadingCover,
    isSubmitting,
    genres,
    categories,
    tags,
    isLoadingDropdowns,
    dropdownsError,
    canGoNext,
    stepTitles,
    goNext,
    goBack,
    createGenreAction,
    createCategoryAction,
    createTagAction,
    handleCoverSelected,
    handleCoverClear,
    uploadCoverAndCreateBook,
    skipAndCreateMinimal,
  };
}
