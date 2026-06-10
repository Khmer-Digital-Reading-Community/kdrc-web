import api from "./api";
import type { Book } from "./bookApi";

export interface ReadingListItem {
  id: string;
  readingListId: string;
  bookId: string;
  position: number;
  book?: Book;
  createdAt: string;
}

export interface ReadingList {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  owner?: { id: string; name?: string; avatarUrl?: string };
  items?: ReadingListItem[];
  createdAt: string;
  updatedAt: string;
}

export const getPublicLists = async (): Promise<ReadingList[]> => {
  const res = await api.get("/reading-lists");
  return res.data;
};

export const getMyLists = async (): Promise<ReadingList[]> => {
  const res = await api.get("/reading-lists/my");
  return res.data;
};

export const getReadingList = async (id: string): Promise<ReadingList> => {
  const res = await api.get(`/reading-lists/${id}`);
  return res.data;
};

export const createReadingList = async (data: {
  name: string;
  description?: string;
  isPublic?: boolean;
  bookIds?: string[];
}): Promise<ReadingList> => {
  const res = await api.post("/reading-lists", data);
  return res.data;
};

export const updateReadingList = async (
  id: string,
  data: { name?: string; description?: string; isPublic?: boolean },
): Promise<ReadingList> => {
  const res = await api.patch(`/reading-lists/${id}`, data);
  return res.data;
};

export const deleteReadingList = async (id: string): Promise<void> => {
  await api.delete(`/reading-lists/${id}`);
};

export const addBookToList = async (listId: string, bookId: string) => {
  const res = await api.post(`/reading-lists/${listId}/books`, { bookId });
  return res.data;
};

export const removeBookFromList = async (
  listId: string,
  bookId: string,
): Promise<void> => {
  await api.delete(`/reading-lists/${listId}/books/${bookId}`);
};

export const reorderList = async (listId: string, bookIds: string[]) => {
  const res = await api.patch(`/reading-lists/${listId}/reorder`, { bookIds });
  return res.data;
};
