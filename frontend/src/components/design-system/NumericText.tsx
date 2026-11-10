import { Tooltip } from "antd";
import type { ReactNode } from "react";

import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatQuantity,
  type NumericValue,
} from "../../utils/format";

export type NumericTone =
  "normal" | "positive" | "negative" | "warning" | "neutral" | "total";

interface NumericTextProps {
  value: NumericValue;
  tone?: NumericTone;
  strong?: boolean;
  children?: ReactNode;
  hidden?: boolean;
  hiddenLabel?: string;
}

function toneFromValue(
  value: NumericValue,
  fallback: NumericTone = "normal",
): NumericTone {
  const numberValue = Number(value ?? 0);
  if (!Number.isFinite(numberValue) || numberValue === 0) {
    return "neutral";
  }
  return fallback;
}

export function AmountText({
  value,
  tone = "normal",
  strong,
  children,
}: NumericTextProps) {
  const resolvedTone = toneFromValue(value, tone);
  const strongClass =
    strong && resolvedTone !== "neutral" ? "app-numeric-text--strong" : "";

  return (
    <span
      className={`app-numeric-text app-numeric-text--${resolvedTone} ${strongClass}`}
    >
      {children ?? formatNumber(value)}
    </span>
  );
}

function MaskedAmount({ label = "••••" }: { label?: string }) {
  return (
    <Tooltip title="You do not have permission to view this amount">
      <span className="app-numeric-text app-numeric-text--neutral">
        {label}
      </span>
    </Tooltip>
  );
}

export function CurrencyText(props: NumericTextProps) {
  if (props.hidden || props.value === null || props.value === undefined) {
    return <MaskedAmount label={props.hiddenLabel} />;
  }
  return <AmountText {...props}>{formatCurrency(props.value)}</AmountText>;
}

export function QuantityText(props: NumericTextProps) {
  return <AmountText {...props}>{formatQuantity(props.value)}</AmountText>;
}

export function PercentageText(props: NumericTextProps) {
  return <AmountText {...props}>{formatPercentage(props.value)}</AmountText>;
}

export function DifferenceText({ value, tone, strong }: NumericTextProps) {
  const numberValue = Number(value ?? 0);
  const resolvedTone =
    tone ??
    (numberValue > 0 ? "positive" : numberValue < 0 ? "negative" : "neutral");
  const sign = numberValue > 0 ? "+" : "";

  return (
    <AmountText value={value} tone={resolvedTone} strong={strong}>
      {sign}
      {formatNumber(value)}
    </AmountText>
  );
}

export function TrendText(props: NumericTextProps) {
  return <DifferenceText {...props} />;
}
