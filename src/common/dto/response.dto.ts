export interface PaginatedResult<R> {
  result?: R[];
  data?: R[];
  metadata: {
    count?: number;
    limit?: number;
    total_pages?: number;
    page?: number;
    has_prev_page?: boolean;
    has_next_page?: boolean;
    prev_page?: number;
    next_page?: number;
    size?: number;
  };
}
