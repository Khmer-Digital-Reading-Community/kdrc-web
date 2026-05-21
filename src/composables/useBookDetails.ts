import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { BookDetails } from "../types/bookDetails";
import { getBookDetail } from "../services/bookApi";
import { resolveCoverUrl, computeRating } from "../services/exploreApi";
import { extractText } from "../utils/content";

/** Convert a raw API Book object (with all relations loaded) to BookDetails. */
function mapToBookDetails(raw: any): BookDetails {
  const reviews = raw.reviews ?? [];
  const chapters = raw.chapters ?? [];

  return {
    id: raw.id,
    title: raw.title,
    description: extractText(raw.content, 500),
    coverImage: resolveCoverUrl(raw.coverImageUrl),
    language: raw.language ?? "English",
    pages: raw.pageCount ?? chapters.length,
    publisher: raw.publisher ?? "Self-published",
    rating: computeRating(reviews) || 0,
    reviewCount: reviews.length,
    author: {
      name: raw.author?.name ?? "Unknown Author",
      bio: raw.author?.bio ?? "",
      image: resolveCoverUrl(raw.author?.avatarUrl),
    },
    chapters: chapters.map((ch: any) => ({
      id: ch.id,
      title: ch.title,
      duration: ch.wordCount
        ? `${Math.max(1, Math.ceil(ch.wordCount / 200))} min`
        : "5 min",
      isPremium: false,
      isPublic: ch.status === "PUBLISHED",
    })),
    reviews: reviews.map((r: any) => ({
      id: r.id,
      userName: r.reviewer?.name ?? "Anonymous",
      userImg: resolveCoverUrl(r.reviewer?.avatarUrl),
      date: r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      title: "",
      comment: r.comment ?? "",
      helpfulCount: 0,
    })),
  };
}

export function useBookDetail() {
  const route = useRoute();
  const book = ref<BookDetails | null>(null);
  const loading = ref(true);

  const fetchBook = async () => {
    try {
      const raw = await getBookDetail(route.params.id as string);
      book.value = mapToBookDetails(raw);
    } catch (error) {
      console.error("Failed to load book details:", error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchBook);

  return { book, loading };
}
