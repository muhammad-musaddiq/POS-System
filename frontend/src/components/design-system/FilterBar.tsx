import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, type FormInstance, type FormProps } from "antd";
import type { ReactNode } from "react";

interface FilterBarProps<T extends object = Record<string, unknown>> {
  form: FormInstance<T>;
  name?: string;
  onFinish: NonNullable<FormProps<T>["onFinish"]>;
  onReset: () => void;
  children: ReactNode;
  loading?: boolean;
  className?: string;
  actions?: ReactNode;
}

export function FilterBar<T extends object = Record<string, unknown>>({
  form,
  name,
  onFinish,
  onReset,
  children,
  loading,
  className = "",
  actions,
}: FilterBarProps<T>) {
  return (
    <Card className={`app-filter-bar ${className}`}>
      <div className="app-filter-bar__header">
        <span className="app-filter-bar__icon">
          <FilterOutlined />
        </span>
        <span>Filters</span>
      </div>
      <Form name={name} form={form} layout="vertical" onFinish={onFinish}>
        <div className="app-filter-bar__grid">
          {children}
          <div className="app-filter-bar__actions">
            {actions}
            <Button
              icon={<ReloadOutlined />}
              onClick={onReset}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Apply
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
}

/** Use inside FilterBar grid for fields that should span multiple columns */
export function FilterField({
  children,
  span = 1,
  className = "",
}: {
  children: ReactNode;
  span?: 1 | 2 | 3;
  className?: string;
}) {
  const spanClass =
    span === 3
      ? "app-filter-field--span-3"
      : span === 2
        ? "app-filter-field--span-2"
        : "";
  return (
    <div className={`app-filter-field ${spanClass} ${className}`}>
      {children}
    </div>
  );
}
