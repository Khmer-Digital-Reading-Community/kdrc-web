import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { BookDetails } from "../types/bookDetails";
import { getBookDetail } from "../services/bookApi";

export function useBookDetail() {
    const route = useRoute();

    const book = ref<BookDetails | null>(null);

    const loading = ref(true);

    const fetchBook = async () => {
        try {
            const data = await getBookDetail(
                route.params.id as string
            );

            book.value = data;
        } catch (error) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchBook);

    return {
        book,
        loading,
    };
}