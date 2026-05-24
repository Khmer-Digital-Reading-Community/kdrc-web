// import { onMounted, ref } from "vue";
// import type { Bookmark } from "../types/bookmark";
// import { getBookmarks } from "../services/bookmarkApi";

// export function useBookmarks() {
//     const bookmarks = ref<Bookmark[]>([]);
//     const loading = ref(true);

//     const fetchBookmarks = async () => {
//         try {
//             const data = await getBookmarks();
//             bookmarks.value = data;
//         } catch (error) {
//             console.error(error);
//         } finally {
//             loading.value = false;
//         }
//     };

//     onMounted(fetchBookmarks);

//     return {
//         bookmarks,
//         loading,
//         fetchBookmarks,
//     };
// }

// Mock data to test
import { onMounted, ref } from "vue";

import type { Bookmark } from "../types/bookmark";

const mockBookmarks: Bookmark[] = [
    {
        id: "1",
        title: "The Whispering Vellum",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        type: "MANUSCRIPT",
        author: "Elias Thorne",
        createdAt: "2026-05-20",
    },
    {
        id: "2",
        title: "Angkor Archive Notes",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        type: "ARTICLE",
        author: "Sreymom Keo",
        source: "Heritage Journal",
        createdAt: "2026-05-18",
    },
    {
        id: "3",
        title: "Temple Light Study",
        coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
        type: "INSPIRATION",
        source: "Design Moodboard",
        createdAt: "2026-05-16",
    },
];

export function useBookmarks() {
    const bookmarks = ref<Bookmark[]>([]);
    const loading = ref(true);

    const fetchBookmarks = async () => {
        bookmarks.value = mockBookmarks;
        loading.value = false;
    };

    onMounted(fetchBookmarks);

    return {
        bookmarks,
        loading,
        fetchBookmarks,
    };
}
