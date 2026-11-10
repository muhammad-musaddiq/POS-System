export interface ApiErrorEnvelope {
  detail?: string | unknown[];
  error?: {
    code: string;
    message: string;
    status_code: number;
  };
  validation_errors?: Array<{
    field: string;
    message: string;
    type: string;
  }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}
