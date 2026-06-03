import api from "./api";
import { resolveCoverUrl } from "./exploreApi";
import type { Bookmark, BookmarkType, RawBookmarkRecord } from "../types/bookmark";

const formatSavedDate = (value?: string) => {
    if (!value) {
        return "";
    }

    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const mapBookmarkRecord = (record: RawBookmarkRecord): Bookmark => {
    const isBookBookmark = record.type === "BOOK";
    const targetId = isBookBookmark
        ? (record.book?.id ?? record.bookId ?? record.id)
        : (record.chapter?.id ?? record.chapterId ?? record.id);

    return {
        id: record.id,
        title: isBookBookmark
            ? (record.book?.title ?? "Untitled Book")
            : (record.chapter?.title ?? "Untitled Chapter"),
        coverImage: resolveCoverUrl(record.book?.coverImageUrl),
        type: record.type,
        author: record.book?.author?.name,
        source: isBookBookmark ? record.book?.publisher : undefined,
        createdAt: formatSavedDate(record.createdAt),
        targetId,
        bookId: record.book?.id ?? record.bookId,
        chapterId: record.chapter?.id ?? record.chapterId,
    };
};

export const getBookmarks = async (): Promise<Bookmark[]> => {
    const response = await api.get<RawBookmarkRecord[]>("/bookmarks");
    return Array.isArray(response.data)
        ? response.data.map(mapBookmarkRecord)
        : [];
};

export const addBookmark = async (type: BookmarkType, targetId: string) => {
    const response = await api.post("/bookmarks", undefined, {
        params: { type, targetId },
    });
    return response.data;
};

export const removeBookmark = async (type: BookmarkType, targetId: string) => {
    const response = await api.delete("/bookmarks", {
        params: { type, targetId },
    });
    return response.data;
};
