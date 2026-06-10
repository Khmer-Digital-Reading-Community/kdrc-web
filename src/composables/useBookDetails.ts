import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { BookDetails } from "../types/bookDetails";
import { getBookDetail } from "../services/bookApi";
import { resolveCoverUrl, computeRating } from "../services/exploreApi";
import { extractText } from "../utils/content";

function splitReviewContent(comment?: string) {
  const rawComment = (comment ?? "").trim();

  if (!rawComment) {
    return {
      title: "Reader Review",
      comment: "",
    };
  }

  const [firstBlock, ...rest] = rawComment.split(/\n\s*\n/);

  if (rest.length > 0 && firstBlock.trim().length <= 120) {
    return {
      title: firstBlock.trim(),
      comment: rest.join("\n\n").trim(),
    };
  }

  return {
    title: "Reader Review",
    comment: rawComment,
  };
}

/** Convert a raw API Book object (with all relations loaded) to BookDetails. */
function mapToBookDetails(raw: any): BookDetails {
  const reviews = raw.reviews ?? [];
  const chapters = raw.chapters ?? [];

  return {
    id: raw.id,
    title: raw.title,
    description: extractText(raw.description, 500),
    coverImage: resolveCoverUrl(raw.coverImageUrl),
    language: raw.language ?? "English",
    pages: raw.pageCount ?? chapters.length,
    publisher: raw.publisher ?? "Self-published",
    rating: computeRating(reviews) || 0,
    reviewCount: reviews.length,
    isFree: raw.isFree ?? false,
    price: Number(raw.price ?? 0),
    isPurchasable: raw.isPurchasable ?? false,
    isPremium: raw.isPremium ?? false,
    author: {
      id: raw.author?.id,
      name: raw.author?.name ?? "Unknown Author",
      bio: raw.metadata?.authorBio ?? raw.author?.bio ?? "",
      image: resolveCoverUrl(raw.author?.avatarUrl),
    },
    chapters: chapters.map((ch: any) => ({
      id: ch.id,
      title: ch.title,
      duration: ch.wordCount
        ? `${Math.max(1, Math.ceil(ch.wordCount / 200))} min`
        : "5 min",
      isPremium: ch.isPremium ?? false,
      isPublic: ch.status === "PUBLISHED",
      isFree: ch.isPremium
        ? false
        : (ch.price != null ? (ch.price === 0 || ch.isFree === true) : (raw.isFree ?? false)),
      price: Number(ch.price ?? 0),
      isPurchasable: ch.isPurchasable ?? false,
    })),
    reviews: reviews.map((r: any) => {
      const content = splitReviewContent(r.comment);

      return {
        id: r.id,
        reviewerId: r.reviewer?.id,
        userName: r.reviewer?.name ?? "Anonymous",
        userImg: resolveCoverUrl(r.reviewer?.avatarUrl),
        date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "",
        rating: Number(r.rating ?? 0),
        title: content.title,
        comment: content.comment,
        helpfulCount: 0,
      };
    }),
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

  return { book, loading, refreshBook: fetchBook };
}
