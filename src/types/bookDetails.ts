export interface Chapter {
    id: string;
    title: string;
    duration: string;
    isPremium: boolean;
    isPublic: boolean;
}

export interface Review {
    id: string;
    reviewerId?: string;
    userName: string;
    userImg: string;
    date: string;
    rating: number;
    title: string;
    comment: string;
    helpfulCount: number;
}

export interface Author {
    id?: string;
    name: string;
    bio: string;
    image: string;
}

export interface BookDetails {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    language: string;
    pages: number;
    publisher: string;
    rating: number;
    reviewCount: number;
    isFree: boolean;
    price: number;
    isPurchasable: boolean;
    isPremium: boolean;
    author: Author;
    chapters: Chapter[];
    reviews: Review[];
}
