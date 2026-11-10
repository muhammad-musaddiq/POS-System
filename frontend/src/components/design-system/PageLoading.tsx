import { Skeleton } from "antd";

interface PageLoadingProps {
  rows?: number;
}

export function PageLoading({ rows = 12 }: PageLoadingProps) {
  return (
    <div className="app-page-loading">
      <Skeleton active paragraph={{ rows }} title={{ width: "30%" }} />
    </div>
  );
}
