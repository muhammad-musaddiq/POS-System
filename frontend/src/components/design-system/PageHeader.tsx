import { ArrowLeftOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Typography } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumbs,
  onBack,
}: PageHeaderProps) {
  return (
    <header className="app-page-header mb-5">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          className="mb-3"
          items={breadcrumbs.map((item) => ({
            title: item.href ? (
              <Link to={item.href}>{item.label}</Link>
            ) : (
              item.label
            ),
          }))}
        />
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {onBack && (
            <Button
              type="text"
              className="app-page-header-back mt-0.5 shrink-0"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              aria-label="Go back"
            />
          )}
          <div className="min-w-0">
            <Typography.Title level={2} className="app-page-title mb-1!">
              {title}
            </Typography.Title>
            {subtitle && (
              <Typography.Text
                type="secondary"
                className="app-page-subtitle text-sm"
              >
                {subtitle}
              </Typography.Text>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 w-full">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
