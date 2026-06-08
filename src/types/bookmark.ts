export type BookmarkType = "BOOK" | "CHAPTER";

export interface RawBookmarkRecord {
    id: string;
    type: BookmarkType;
    bookId?: string;
    chapterId?: string;
    createdAt: string;
    book?: {
        id: string;
        title?: string;
        coverImageUrl?: string;
        publisher?: string;
        author?: {
            name?: string;
        };
    };
    chapter?: {
        id: string;
        title?: string;
        bookId?: string;
    };
}

export interface Bookmark {
    id: string;
    title: string;
    coverImage: string;
    type: BookmarkType;
    author?: string;
    source?: string;
    createdAt: string;
    targetId: string;
    bookId?: string;
    chapterId?: string;
}
