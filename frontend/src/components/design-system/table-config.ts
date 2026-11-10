import type { TablePaginationConfig } from "antd";

interface PaginatedFilters {
  page: number;
  page_size: number;
}

export function buildTablePagination(
  filters: PaginatedFilters,
  total: number | undefined,
  onChange: (page: number, pageSize: number) => void,
  entityLabel: string,
): TablePaginationConfig {
  return {
    current: filters.page,
    pageSize: filters.page_size,
    total,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    showTotal: (total) => `${total.toLocaleString()} ${entityLabel}`,
    onChange,
  };
}
