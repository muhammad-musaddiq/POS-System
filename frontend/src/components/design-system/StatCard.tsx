import { isValidElement, type ReactNode } from "react";
import { Card, Skeleton, Statistic } from "antd";

interface StatCardProps {
  label: string;
  value?: number | string | ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  accentColor?: string;
  trend?: ReactNode;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  icon,
  loading = false,
  accentColor,
  trend,
  onClick,
}: StatCardProps) {
  return (
    <Card
      className={`app-stat-card h-full transition-shadow hover:shadow-md ${onClick ? "cursor-pointer" : ""}`}
      styles={{ body: { padding: "20px 22px" } }}
      onClick={onClick}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {icon && (
          <span
            className="app-stat-card-icon flex size-10 shrink-0 items-center justify-center rounded-lg text-lg"
            style={
              accentColor
                ? { backgroundColor: `${accentColor}14`, color: accentColor }
                : undefined
            }
          >
            {icon}
          </span>
        )}
      </div>
      {loading ? (
        <Skeleton.Input active size="small" className="w-24!" />
      ) : (
        <div className="flex items-end justify-between gap-2">
          {isValidElement(value) ? (
            <div className="app-stat-card-value text-[28px] leading-[1.2]">
              {value}
            </div>
          ) : (
            <Statistic
              value={(value as string | number | undefined) ?? 0}
              className="app-stat-card-value"
              styles={{
                content: { fontSize: 28, fontWeight: 700, lineHeight: 1.2 },
              }}
            />
          )}
          {trend}
        </div>
      )}
    </Card>
  );
}
