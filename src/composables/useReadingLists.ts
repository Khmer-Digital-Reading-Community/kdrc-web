import { ref, onMounted } from "vue";
import {
  getMyLists,
  getPublicLists,
  createReadingList,
  deleteReadingList,
  updateReadingList,
  addBookToList,
  removeBookFromList,
  type ReadingList,
} from "../services/readingListApi";
import { token } from "../services/auth";

export function useReadingLists() {
  const myLists = ref<ReadingList[]>([]);
  const publicLists = ref<ReadingList[]>([]);
  const loading = ref(false);

  const fetchMyLists = async () => {
    if (!token.value) return;
    try {
      myLists.value = await getMyLists();
    } catch {
      // ignore
    }
  };

  const fetchPublicLists = async () => {
    try {
      publicLists.value = await getPublicLists();
    } catch {
      // ignore
    }
  };

  const create = async (data: {
    name: string;
    description?: string;
    isPublic?: boolean;
  }) => {
    loading.value = true;
    try {
      const list = await createReadingList(data);
      myLists.value.unshift(list);
      if (data.isPublic !== false) {
        publicLists.value.unshift(list);
      }
      return list;
    } catch (err) {
      console.error("Failed to create reading list:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const remove = async (id: string) => {
    loading.value = true;
    try {
      await deleteReadingList(id);
      myLists.value = myLists.value.filter((l) => l.id !== id);
      publicLists.value = publicLists.value.filter((l) => l.id !== id);
    } catch (err) {
      console.error("Failed to delete reading list:", err);
    } finally {
      loading.value = false;
    }
  };

  const addBook = async (listId: string, bookId: string) => {
    try {
      await addBookToList(listId, bookId);
      await fetchMyLists();
    } catch (err) {
      console.error("Failed to add book to list:", err);
    }
  };

  const removeBook = async (listId: string, bookId: string) => {
    try {
      await removeBookFromList(listId, bookId);
      await fetchMyLists();
    } catch (err) {
      console.error("Failed to remove book from list:", err);
    }
  };

  onMounted(() => {
    fetchMyLists();
    fetchPublicLists();
  });

  return {
    myLists,
    publicLists,
    loading,
    fetchMyLists,
    fetchPublicLists,
    create,
    remove,
    addBook,
    removeBook,
  };
}
