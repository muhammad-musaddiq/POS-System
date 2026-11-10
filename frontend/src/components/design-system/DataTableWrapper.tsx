import { Card, Table, type TableProps } from "antd";
import type { ReactNode } from "react";

import { EmptyState } from "./EmptyState";
import { appTableDefaults } from "./tokens";

interface DataTableWrapperProps<T extends object> extends Omit<
  TableProps<T>,
  "title"
> {
  title?: ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function DataTableWrapper<T extends object>({
  title,
  extra,
  className,
  size = appTableDefaults.size,
  scroll,
  locale,
  pagination,
  emptyTitle,
  emptyDescription,
  emptyAction,
  ...tableProps
}: DataTableWrapperProps<T>) {
  const cardTitle =
    title || extra ? (
      <div className="flex flex-wrap items-center justify-between gap-3">
        {title && <span className="font-semibold text-gray-900">{title}</span>}
        {extra}
      </div>
    ) : undefined;

  const resolvedPagination =
    pagination === false
      ? false
      : pagination
        ? { className: "app-table-pagination", ...pagination }
        : undefined;

  return (
    <Card
      className={`app-data-table ${className ?? ""}`}
      title={cardTitle}
      styles={{ body: { padding: 0 } }}
    >
      <Table<T>
        size={size}
        className="app-table"
        scroll={{ x: scroll?.x ?? appTableDefaults.scrollX, ...scroll }}
        pagination={resolvedPagination}
        locale={{
          emptyText: (
            <EmptyState
              compact
              title={emptyTitle}
              description={emptyDescription}
              action={emptyAction}
            />
          ),
          ...locale,
        }}
        {...tableProps}
      />
    </Card>
  );
}
