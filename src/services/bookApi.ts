import axios from "axios"

export const getBookDetail = async (id: string) => {
    const response = await axios.get(`/books/${id}`);
    return response.data.data;
};