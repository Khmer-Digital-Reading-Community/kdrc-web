import api from "./api";

export interface Purchase {
  id: string;
  userId: string;
  bookId?: string;
  chapterId?: string;
  amount: number;
  status: "COMPLETED" | "PENDING" | "REFUNDED";
  book?: { id: string; title: string; coverImageUrl?: string };
  chapter?: { id: string; title: string; chapterNumber: number };
  createdAt: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  coverImageUrl?: string;
  description?: string;
  author?: { id: string; name?: string };
  purchasedAt: string;
}

export const buyBook = async (bookId: string) => {
  const res = await api.post(`/purchases/book/${bookId}`);
  return res.data;
};

export const buyChapter = async (chapterId: string) => {
  const res = await api.post(`/purchases/chapter/${chapterId}`);
  return res.data;
};

export const checkBookOwnership = async (bookId: string) => {
  const res = await api.get(`/purchases/check/book/${bookId}`);
  return res.data as { owned: boolean; purchase?: Purchase };
};

export const checkChapterOwnership = async (chapterId: string) => {
  const res = await api.get(`/purchases/check/chapter/${chapterId}`);
  return res.data as { owned: boolean; purchase?: Purchase };
};

export const getMyPurchases = async (): Promise<Purchase[]> => {
  const res = await api.get("/purchases/my");
  return res.data;
};

export const getMyLibrary = async (): Promise<LibraryBook[]> => {
  const res = await api.get("/purchases/library");
  return res.data;
};

export const getCredits = async () => {
  const res = await api.get("/users/me/credits");
  return res.data as { credits: number };
};

export const addCredits = async (amount: number) => {
  const res = await api.post("/users/me/credits", { amount });
  return res.data as { credits: number };
};
