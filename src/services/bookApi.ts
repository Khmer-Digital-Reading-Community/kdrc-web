import api from "./api";

export interface BookMetadata {
  id?: string;
  subtitle?: string;
  authorBio?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  ageRating?: "G" | "PG" | "PG-13" | "R" | "NC-17";
  contentWarnings?: string[];
  seriesName?: string;
  seriesPosition?: number;
  estimatedReadingTime?: number;
}

export interface CreateReviewPayload {
  bookId: string;
  rating: number;
  comment?: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  content?: string;
  coverImageUrl?: string;
  language?: string;
  genre?: Genre;
  genreSlug?: string;
  categorySlugs?: string[];
  tagSlugs?: string[];
  pageCount?: number;
  publisher?: string;
  // Relations
  author?: { id: string; name?: string; bio?: string; avatarUrl?: string };
  categories?: Array<{ id: number; slug: string; name: string }>;
  tags?: Tag[];
  metadata?: BookMetadata;
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
  isFree?: boolean;
  price?: number;
  isPurchasable?: boolean;
  isPremium?: boolean;
  tableOfContents?: string;
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

export const getBookBasic = async (id: string): Promise<Partial<Book>> => {
  const response = await api.get(`/books/${id}/basic`);
  return response.data;
};

export const createBook = async (data: Partial<Book>): Promise<Book> => {
  const response = await api.post("/books", data);
  return response.data;
};

export const uploadBookCover = async (
  file: File,
): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
  size: number;
}> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/books/cover", formData);
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

export const createReview = async (data: CreateReviewPayload) => {
  const response = await api.post("/reviews", data);
  return response.data;
};

// Genres API
export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get("/genres");
  return response.data;
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

// Tags API
export const getTags = async (): Promise<Tag[]> => {
  const response = await api.get("/tags");
  const payload = response.data;
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && Array.isArray(payload.data)) return payload.data;
  return [];
};
