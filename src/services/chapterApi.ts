import api from "./api";

export interface Chapter {
  id: string;
  title: string;
  content?: string;
  chapterNumber: number;
  order: number;
  type: "PROLOGUE" | "CHAPTER" | "BONUS" | "EPILOGUE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  description?: string;
  wordCount?: number;
  price?: number;
  isPurchasable?: boolean;
  isPremium?: boolean;
  bookId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterContent extends Chapter {
  wordCount: number;
  readingTimeMinutes: number;
}

export const getChapters = async (bookId: string): Promise<Chapter[]> => {
  const response = await api.get(`/chapters/book/${bookId}`);
  return response.data;
};

export const getChapterContent = async (
  id: string,
): Promise<ChapterContent> => {
  const response = await api.get(`/chapters/${id}/content`);
  return response.data;
};

export const createChapter = async (
  data: Partial<Chapter>,
): Promise<Chapter> => {
  const response = await api.post("/chapters", data);
  return response.data;
};

export const updateChapter = async (
  id: string,
  data: Partial<Chapter>,
): Promise<Chapter> => {
  const response = await api.patch(`/chapters/${id}`, data);
  return response.data;
};

export const deleteChapter = async (id: string): Promise<void> => {
  await api.delete(`/chapters/${id}`);
};
