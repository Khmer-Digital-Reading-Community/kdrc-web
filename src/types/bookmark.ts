export interface Bookmark {
    id: string;
    title: string;
    coverImage: string;
    type: "MANUSCRIPT" | "ARTICLE" | "INSPIRATION";
    author?: string;
    source?: string;
    createdAt: string;
}