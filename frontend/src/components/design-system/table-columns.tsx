import type { ReactNode } from "react";
import type { ColumnType } from "antd/es/table";

import { CurrencyText, QuantityText, type NumericTone } from "./NumericText";

type RowRecord = Record<string, unknown>;

export function truncateCell(value: ReactNode, title?: string) {
  const text = title ?? (typeof value === "string" ? value : undefined);
  return (
    <span className="app-cell-text block max-w-[220px] truncate" title={text}>
      {value}
    </span>
  );
}

export function textColumn<T extends RowRecord>(
  title: string,
  dataIndex: keyof T & string,
  options?: { width?: number; secondary?: boolean },
): ColumnType<T> {
  return {
    title,
    dataIndex,
    key: dataIndex,
    ellipsis: true,
    width: options?.width,
    className: options?.secondary ? "app-cell-muted" : undefined,
    render: (value: unknown) => (
      <span
        className="app-cell-text block max-w-[240px] truncate"
        title={String(value ?? "")}
      >
        {value == null || value === "" ? "—" : String(value)}
      </span>
    ),
  };
}

export function numericColumn<T extends RowRecord>(
  title: string,
  dataIndex: keyof T & string,
  render?: ColumnType<T>["render"],
): ColumnType<T> {
  return {
    title,
    dataIndex,
    key: dataIndex,
    align: "right",
    className: "app-cell-numeric",
    render,
  };
}

export function currencyColumn<T extends RowRecord>(
  title: string,
  dataIndex: keyof T & string,
  render?: ColumnType<T>["render"],
  options?: { tone?: NumericTone; strong?: boolean },
): ColumnType<T> {
  return numericColumn(
    title,
    dataIndex,
    render ??
      ((value) => (
        <CurrencyText
          value={value as string | number}
          tone={options?.tone}
          strong={options?.strong}
        />
      )),
  );
}

export function quantityColumn<T extends RowRecord>(
  title: string,
  dataIndex: keyof T & string,
  options?: { tone?: NumericTone; strong?: boolean },
): ColumnType<T> {
  return numericColumn(title, dataIndex, (value) => (
    <QuantityText
      value={value as string | number}
      tone={options?.tone}
      strong={options?.strong}
    />
  ));
}
