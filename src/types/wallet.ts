type Balance = {
  token_balance: {
    token_balance_get: number;
    token_balance_get_in_process: number;
    token_balance_gyt: number;
    token_balance_gyt_in_process: number;
  };
};

type HistoryItem = {
  actionDescription: string;
  createdTimestamp: string;
  customerUUID: string;
  fromCustomerUUID: string | null;
  id: number;
  merchantLocationUUID: string | null;
  merchantUUID: string | null;
  processed: boolean;
  recentOperations: any[];
  rewardGetToken: number;
  status: string;
  type:
    | "transfer"
    | "CheckIn"
    | "CheckInQRCode"
    | "Referral"
    | "Review"
    | "Survey";
  updateTimestamp: string;
  uuid: string;
  location_name?: string;
};

// History response from backend
type History = {
  content: HistoryItem[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  totalElements: number;
  totalPages: number;
};

// Paginated response from TanStack Infinite Query
type PaginatedHistory = {
  pages: History[];
  pageParams: number[];
};

export { Balance, History, HistoryItem, PaginatedHistory };
