import { Card, Typography } from "antd";
import type { ReactNode } from "react";

interface SettingSectionProps {
  title: string;
  description?: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SettingSection({
  title,
  description,
  extra,
  children,
  className,
}: SettingSectionProps) {
  return (
    <Card
      className={`app-card ${className ?? ""}`}
      styles={{ body: { paddingTop: 20 } }}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Typography.Title level={5} className="mb-0.5!">
            {title}
          </Typography.Title>
          {description && (
            <Typography.Text type="secondary" className="text-sm">
              {description}
            </Typography.Text>
          )}
        </div>
        {extra}
      </div>
      {children}
    </Card>
  );
}
