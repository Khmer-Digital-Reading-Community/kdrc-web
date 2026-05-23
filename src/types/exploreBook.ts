export interface ExploreBook {
    id: string;
    title: string;
    author: string;
    rating: number;
    lang: string;
    category: string;
    description: string;
    coverImage: string;
    genre?: string;
    tags?: string[];
    createdAt: string;
}