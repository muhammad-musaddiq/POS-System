/** Shared layout widths for application pages */
export const pageMaxWidths = {
  default: 1600,
  wide: 1700,
  narrow: 1400,
  form: 1200,
  auth: 440,
} as const;

export type PageWidth = keyof typeof pageMaxWidths;

/** Consistent elevation tokens */
export const appShadows = {
  sm: "0 1px 2px rgba(15, 23, 42, 0.04)",
  md: "0 4px 16px rgba(15, 23, 42, 0.06)",
  lg: "0 8px 24px rgba(15, 23, 42, 0.08)",
} as const;

/** Standard table configuration */
export const appTableDefaults = {
  size: "middle" as const,
  scrollX: 960,
};
