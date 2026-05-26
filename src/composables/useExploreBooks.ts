// import { onMounted, ref } from "vue";
// import type { ExploreBook } from "../types/exploreBook";
// import { getExploreBooks } from "../services/exploreApi";

// export function useExploreBooks() {
//     const books = ref<ExploreBook[]>([]);
//     const loading = ref(true);
//     const error = ref("");

//     const fetchBooks = async () => {
//         try {
//             const data = await getExploreBooks();
//             console.log(data);
//             books.value = data;
//         } catch (err) {
//             console.error(err);
//             error.value = "Failed to fetch books";
//         } finally {
//             loading.value = false;
//         }
//     };

//     onMounted(fetchBooks);

//     return {
//         books,
//         loading,
//         error,
//     };
// }

// Testing with mock data
import { ref } from "vue";

import type { ExploreBook } from "../types/exploreBook";

export function useExploreBooks() {

    const loading = ref(false);

    const error = ref("");

    const books =
        ref<ExploreBook[]>([
            {
                id: "1",

                title: "The Whispering Vellum",

                author: "Elias Thorne",

                rating: 4.8,

                lang: "Khmer",

                category:
                    "Khmer Literature",

                description:
                    "A journey through forgotten temples and ancient Khmer wisdom.",

                coverImage:
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f",

                createdAt:
                    "2026-05-20",
            },

            {
                id: "2",

                title:
                    "The Last Manuscript",

                author: "LINA CHAN",

                rating: 4.7,

                lang: "English",

                category: "Novels",

                description:
                    "A literary mystery hidden beneath layers of political intrigue.",

                coverImage:
                    "https://images.unsplash.com/photo-1512820790803-83ca734da794",

                createdAt:
                    "2026-05-18",
            },

            {
                id: "3",

                title:
                    "Physics Beyond Reality",

                author: "DAVID CLARK",

                rating: 4.8,

                lang: "English",

                category: "Education",

                description:
                    "Exploring advanced scientific concepts in an accessible way.",

                coverImage:
                    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",

                createdAt:
                    "2026-05-15",
            },

            {
                id: "4",

                title:
                    "Stars Between Worlds",

                author: "MIRA KENT",

                rating: 3.0,

                lang: "French",

                category: "Sci-Fi",

                description:
                    "An interstellar odyssey about memory, war, and identity.",

                coverImage:
                    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",

                createdAt:
                    "2026-05-12",
            },
        ]);

    return {
        books,
        loading,
        error,
    };
}