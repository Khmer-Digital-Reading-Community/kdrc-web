import { onMounted, ref } from "vue";
import type { Bookmark } from "../types/bookmark";
import { getBookmarks } from "../services/bookmarkApi";

export function useBookmarks() {
    const bookmarks = ref<Bookmark[]>([]);
    const loading = ref(true);

    const fetchBookmarks = async () => {
        try {
            const data = await getBookmarks();
            bookmarks.value = data;
        } catch (error) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchBookmarks);

    return {
        bookmarks,
        loading,
        fetchBookmarks,
    };
}