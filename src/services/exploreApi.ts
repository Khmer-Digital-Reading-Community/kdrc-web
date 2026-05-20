import axios from "axios";

export const getExploreBooks = async () => {
    const response = await axios.get("/books");

    return response.data.data;
}