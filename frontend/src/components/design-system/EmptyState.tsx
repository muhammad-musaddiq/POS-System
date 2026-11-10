import { InboxOutlined } from "@ant-design/icons";
import { Empty, Typography } from "antd";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Records will appear here once created, or try adjusting your filters.",
  icon,
  action,
  compact = false,
}: EmptyStateProps) {
  if (compact) {
    return (
      <div className="app-empty-state-compact px-4 py-8 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <Typography.Text className="font-medium text-gray-700">
                {title}
              </Typography.Text>
              {description && (
                <div className="mt-1 text-sm text-gray-500">{description}</div>
              )}
            </div>
          }
        >
          {action}
        </Empty>
      </div>
    );
  }

  return (
    <div className="app-empty-state flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl text-gray-400">
        {icon ?? <InboxOutlined />}
      </div>
      <Typography.Title level={4} className="mb-1! text-lg!">
        {title}
      </Typography.Title>
      <Typography.Text type="secondary" className="mb-4 max-w-sm">
        {description}
      </Typography.Text>
      {action}
    </div>
  );
}
