export interface ExploreBook {
    id: string;
    title: string;
    author: string;
    rating: number;
    lang: string;
    category: string;
    genre?: string | string[];
    description: string;
    coverImage: string;
    tags?: string[];
    createdAt: string;
}