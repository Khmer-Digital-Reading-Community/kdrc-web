import api from "./api";

export interface Book {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string;
  language?: string;
  genre?: string;
  pageCount?: number;
  publisher?: string;
  // Relations loaded by findOne
  author?: { id: string; name?: string; bio?: string; avatarUrl?: string };
  categories?: Array<{ id: number; slug: string; name: string }>;
  chapters?: Array<{
    id: string;
    title: string;
    chapterNumber: number;
    order: number;
    type: string;
    status: string;
    wordCount?: number;
    description?: string;
    bookId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string;
    reviewer?: { id: string; name?: string; avatarUrl?: string };
    createdAt: string;
  }>;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "DISCONTINUED";
  createdAt: string;
  updatedAt: string;
}

export interface AuthorStats {
  totalBooks: number;
  totalPublished: number;
  totalWords: number;
  streakDays: number;
  engagementRate: number;
}

export const getMyBooks = async (): Promise<Book[]> => {
  const response = await api.get("/books/me/list");
  return response.data;
};

export const getMyBookStats = async (): Promise<AuthorStats> => {
  const response = await api.get("/books/me/stats");
  return response.data;
};

export const getBookDetail = async (id: string): Promise<Book> => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (data: Partial<Book>): Promise<Book> => {
  const response = await api.post("/books", data);
  return response.data;
};

export const uploadBookCover = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/books/cover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBook = async (
  id: string,
  data: Partial<Book>,
): Promise<Book> => {
  const response = await api.patch(`/books/${id}`, data);
  return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await api.delete(`/books/${id}`);
};
