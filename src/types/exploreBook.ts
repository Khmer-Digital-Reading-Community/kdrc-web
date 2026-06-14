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
    isFree: boolean;
    isPurchasable: boolean;
    isPremium: boolean;
    price: number;
    readCount: number;
    likeCount: number;
}