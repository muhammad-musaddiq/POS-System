import { Card, Typography } from "antd";
import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  extra?: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  extra,
  className = "",
}: FormSectionProps) {
  return (
    <Card
      className={`app-form-section ${className}`}
      title={
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Typography.Text className="text-base font-semibold text-gray-900">
              {title}
            </Typography.Text>
            {description && (
              <div className="mt-0.5 text-sm font-normal text-gray-500">
                {description}
              </div>
            )}
          </div>
          {extra}
        </div>
      }
      styles={{ body: { padding: "18px 20px" } }}
    >
      {children}
    </Card>
  );
}
