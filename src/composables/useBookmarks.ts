import { onMounted, ref } from "vue";
import type { Bookmark, BookmarkType } from "../types/bookmark";
import { addBookmark, getBookmarks, removeBookmark } from "../services/bookmarkApi";
import { token } from "../services/auth";
import router from "../routes";
import { useToast } from "vue-toastification";

const bookmarks = ref<Bookmark[]>([]);
const loading = ref(true);
const initialized = ref(false);
const bookmarkedBookIds = ref<string[]>([]);
const bookmarkedChapterIds = ref<string[]>([]);
let pendingFetch: Promise<void> | null = null;

const syncBookmarkState = (items: Bookmark[]) => {
    bookmarks.value = items;
    bookmarkedBookIds.value = items
        .filter((item) => item.type === "BOOK" && item.bookId)
        .map((item) => item.bookId as string);
    bookmarkedChapterIds.value = items
        .filter((item) => item.type === "CHAPTER" && item.chapterId)
        .map((item) => item.chapterId as string);
};

export function useBookmarks() {
    const toast = useToast();

    const fetchBookmarks = async (force = false) => {
        if (!token.value) {
            syncBookmarkState([]);
            initialized.value = false;
            return;
        }

        if (pendingFetch) {
            return pendingFetch;
        }

        if (initialized.value && !force) {
            return;
        }

        loading.value = true;
        pendingFetch = (async () => {
            try {
                syncBookmarkState(await getBookmarks());
                initialized.value = true;
            } catch (error) {
                console.error("Failed to fetch bookmarks:", error);
            } finally {
                loading.value = false;
                pendingFetch = null;
            }
        })();

        return pendingFetch;
    };

    const isBookmarked = (targetId: string, type: BookmarkType = "BOOK") => {
        return type === "BOOK"
            ? bookmarkedBookIds.value.includes(targetId)
            : bookmarkedChapterIds.value.includes(targetId);
    };

    const toggleBookmark = async (targetId: string, type: BookmarkType = "BOOK") => {
        if (!token.value) {
            toast.info("Please log in to save bookmarks.");
            throw new Error("Please log in to save bookmarks.");
        }

        const alreadyBookmarked = isBookmarked(targetId, type);

        if (alreadyBookmarked) {
            await removeBookmark(type, targetId);
            toast.info(
                type === "BOOK"
                    ? "Removed from bookmarks."
                    : "Removed chapter bookmark.",
            );
        } else {
            await addBookmark(type, targetId);
            toast.success(
                type === "BOOK"
                    ? "Book added to bookmarks. Click to open your saved books."
                    : "Chapter added to bookmarks. Click to open your saved books.",
                {
                    onClick: () => {
                        void router.push({ name: "bookmarks" });
                    },
                },
            );
        }

        await fetchBookmarks(true);
        return isBookmarked(targetId, type);
    };

    const toggleBookBookmark = async (bookId: string) => {
        return toggleBookmark(bookId, "BOOK");
    };

    const toggleChapterBookmark = async (chapterId: string) => {
        return toggleBookmark(chapterId, "CHAPTER");
    };

    onMounted(() => {
        void fetchBookmarks();
    });

    return {
        bookmarks,
        loading,
        fetchBookmarks,
        isBookmarked,
        toggleBookmark,
        toggleBookBookmark,
        toggleChapterBookmark,
    };
}
