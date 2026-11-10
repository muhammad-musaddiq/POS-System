import { Tag } from "antd";

export type StatusVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "pending"
  | "processing";

const variantStyles: Record<
  StatusVariant,
  { color: string; background: string; border: string }
> = {
  default: { color: "#475569", background: "#F1F5F9", border: "#E2E8F0" },
  info: {
    color: "var(--app-info)",
    background: "color-mix(in srgb, var(--app-info) 10%, white)",
    border: "color-mix(in srgb, var(--app-info) 24%, white)",
  },
  success: {
    color: "var(--app-success)",
    background: "color-mix(in srgb, var(--app-success) 10%, white)",
    border: "color-mix(in srgb, var(--app-success) 24%, white)",
  },
  warning: {
    color: "var(--app-warning)",
    background: "color-mix(in srgb, var(--app-warning) 10%, white)",
    border: "color-mix(in srgb, var(--app-warning) 24%, white)",
  },
  danger: {
    color: "var(--app-error)",
    background: "color-mix(in srgb, var(--app-error) 10%, white)",
    border: "color-mix(in srgb, var(--app-error) 24%, white)",
  },
  pending: { color: "#7C3AED", background: "#F5F3FF", border: "#DDD6FE" },
  processing: { color: "#0369A1", background: "#F0F9FF", border: "#BAE6FD" },
};

interface StatusTagProps {
  label: string;
  variant?: StatusVariant;
}

export function StatusTag({ label, variant = "default" }: StatusTagProps) {
  const style = variantStyles[variant];

  return (
    <Tag
      variant="filled"
      className="app-status-tag m-0! inline-flex! max-w-full items-center"
      style={{
        color: style.color,
        backgroundColor: style.background,
        border: `1px solid ${style.border}`,
      }}
    >
      <span className="truncate">{label}</span>
    </Tag>
  );
}

/** Map Ant Design preset badge colors to unified status variants. */
export function presetToVariant(
  preset: "default" | "success" | "processing" | "error" | "warning",
): StatusVariant {
  switch (preset) {
    case "success":
      return "success";
    case "processing":
      return "processing";
    case "error":
      return "danger";
    case "warning":
      return "warning";
    default:
      return "default";
  }
}

/** Map Ant Design Tag color presets to unified status variants. */
export function tagColorToVariant(color: string): StatusVariant {
  switch (color) {
    case "green":
    case "cyan":
      return "success";
    case "blue":
      return "info";
    case "gold":
    case "orange":
      return "warning";
    case "red":
      return "danger";
    case "purple":
      return "pending";
    case "processing":
      return "processing";
    default:
      return "default";
  }
}
