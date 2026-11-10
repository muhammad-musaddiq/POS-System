const dateFormatter = new Intl.DateTimeFormat(
  import.meta.env.VITE_LOCALE || "en-US",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
);

const compactNumberFormatter = new Intl.NumberFormat(
  import.meta.env.VITE_LOCALE || "en-US",
  {
    maximumFractionDigits: 0,
  },
);

const quantityFormatter = new Intl.NumberFormat(
  import.meta.env.VITE_LOCALE || "en-US",
  {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  },
);

const percentageFormatter = new Intl.NumberFormat(
  import.meta.env.VITE_LOCALE || "en-US",
  {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
);

export type NumericValue = string | number | null | undefined;

export function formatNumber(value: NumericValue): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return compactNumberFormatter.format(Number(value));
}

export function formatQuantity(value: NumericValue): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return quantityFormatter.format(Number(value));
}

export function formatPercentage(value: NumericValue): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return `${percentageFormatter.format(Number(value))}%`;
}

export function formatCurrency(value: NumericValue): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return new Intl.NumberFormat(import.meta.env.VITE_LOCALE || "en-US", {
    style: "currency",
    currency: import.meta.env.VITE_CURRENCY || "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatCurrencyDetailed(value: NumericValue): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return new Intl.NumberFormat(import.meta.env.VITE_LOCALE || "en-US", {
    style: "currency",
    currency: import.meta.env.VITE_CURRENCY || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Not set";
  }
  return dateFormatter.format(new Date(value));
}

export function formatStatus(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function daysUntil(value: string): number {
  const dueDate = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((dueDate.getTime() - today.getTime()) / 86_400_000);
}
