export type ExchangeOwner = {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
};

export type ExchangeListing = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  condition: string;
  exchangeType: string;
  location: string;
  price?: number | string | null;
  tradingFor: string;
  description: string;
  contactNumber?: string | null;
  listingStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: ExchangeOwner | null;
};

export type ExchangeSearchResult = {
  data: ExchangeListing[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
};

export type ExchangeRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'MEETING_SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type ExchangeRequest = {
  id: string;
  status: ExchangeRequestStatus;
  message?: string | null;
  meetingLocation?: string | null;
  meetingTime?: string | null;
  createdAt: string;
  updatedAt: string;
  exchange: ExchangeListing | null;
  requester: ExchangeOwner | null;
  offeredExchange: Pick<
    ExchangeListing,
    'id' | 'title' | 'author' | 'imageUrl' | 'location' | 'condition'
  > | null;
};
