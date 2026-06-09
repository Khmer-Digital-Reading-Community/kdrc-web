import { ref, onMounted } from "vue";
import {
  updateBook,
  uploadBookCover,
  getGenres,
  getCategories,
  getTags,
  type Book,
  type Genre,
  type Category,
  type Tag,
} from "../services/bookApi";
import { useToast } from "vue-toastification";

export function useBookSettings(bookId: string) {
  const toast = useToast();

  const title = ref("");
  const description = ref("");
  const genreSlug = ref<string>("");
  const categorySlugs = ref<string[]>([]);
  const tagSlugs = ref<string[]>([]);
  const coverUrl = ref<string | null>(null);
  const isFree = ref(false);
  const price = ref(0);
  const isPurchasable = ref(false);
  const isPremium = ref(false);
  const isSaving = ref(false);

  const genres = ref<Genre[]>([]);
  const categories = ref<Category[]>([]);
  const tags = ref<Tag[]>([]);
  const isLoadingDropdowns = ref(false);
  const dropdownsError = ref<string | null>(null);

  const coverFile = ref<File | null>(null);
  const coverPreviewUrl = ref<string | null>(null);
  const isUploadingCover = ref(false);

  function loadFromBook(book: Book) {
    title.value = book.title || "";
    description.value = book.description || "";
    genreSlug.value = book.genreSlug || book.genre?.slug || "";
    categorySlugs.value = book.categorySlugs || book.categories?.map((c) => c.slug) || [];
    tagSlugs.value = book.tagSlugs || book.tags?.map((t) => t.slug) || [];
    coverUrl.value = book.coverImageUrl || null;
    coverPreviewUrl.value = book.coverImageUrl || null;
    isFree.value = book.isFree ?? false;
    price.value = book.price ?? 0;
    isPurchasable.value = book.isPurchasable ?? false;
    isPremium.value = book.isPremium ?? false;
  }

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
      dropdownsError.value = "Failed to load options.";
    } finally {
      isLoadingDropdowns.value = false;
    }
  });

  function handleCoverSelected(file: File) {
    coverFile.value = file;
    coverPreviewUrl.value = URL.createObjectURL(file);
  }

  function handleCoverClear() {
    coverFile.value = null;
    coverPreviewUrl.value = null;
    coverUrl.value = null;
  }

  async function saveMetadata(): Promise<boolean> {
    isSaving.value = true;
    try {
      let uploadedUrl = coverUrl.value;
      if (coverFile.value) {
        isUploadingCover.value = true;
        const result = await uploadBookCover(coverFile.value);
        uploadedUrl = result.url;
        coverUrl.value = uploadedUrl;
        coverFile.value = null;
        isUploadingCover.value = false;
      }

      await updateBook(bookId, {
        title: title.value,
        description: description.value,
        coverImageUrl: uploadedUrl || undefined,
        genreSlug: genreSlug.value || undefined,
        categorySlugs: categorySlugs.value,
        tagSlugs: tagSlugs.value,
        isFree: isFree.value,
      });
      toast.success("Book details saved");
      return true;
    } catch {
      toast.error("Failed to save book details");
      return false;
    } finally {
      isSaving.value = false;
      isUploadingCover.value = false;
    }
  }

  async function savePricing(): Promise<boolean> {
    isSaving.value = true;
    try {
      await updateBook(bookId, {
        price: price.value,
        isPurchasable: isPurchasable.value,
        isPremium: isPremium.value,
        isFree: isFree.value,
      });
      toast.success("Pricing saved");
      return true;
    } catch {
      toast.error("Failed to save pricing");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    title,
    description,
    genreSlug,
    categorySlugs,
    tagSlugs,
    coverUrl,
    coverPreviewUrl,
    isFree,
    price,
    isPurchasable,
    isPremium,
    isSaving,
    isUploadingCover,
    genres,
    categories,
    tags,
    isLoadingDropdowns,
    dropdownsError,
    loadFromBook,
    handleCoverSelected,
    handleCoverClear,
    saveMetadata,
    savePricing,
  };
}
