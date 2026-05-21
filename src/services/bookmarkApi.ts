import axios from "axios"

export const getBookmarks = async () => {
    const response = await axios.get("/bookmarks");
    return response.data.data;
};

export const addBookmark = async (bookId: string) => {
    const response = await axios.post(`/bookmarks/${bookId}`);
    return response.data;
};

export const removeBookmark = async (bookId: string) => {
    const response = await axios.delete(`/bookmarks/${bookId}`);
    return response.data;
};