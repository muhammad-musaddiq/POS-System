const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_REGEX.test(value);
}

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed.match(/^#(.)(.)(.)$/) ?? [];
    if (!r || !g || !b) return null;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  if (HEX_COLOR_REGEX.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  return null;
}

export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

export function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const clamped = Math.min(1, Math.max(0, alpha));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamped})`;
}

export function mixHexColors(
  colorA: string,
  colorB: string,
  weightB = 0.5,
): string {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  if (!a || !b) return colorA;
  const weight = Math.min(1, Math.max(0, weightB));
  const mix = (left: number, right: number) =>
    Math.round(left * (1 - weight) + right * weight);
  const channels = [mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b)];
  return `#${channels
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export function getContrastTextColor(
  bgColor: string,
  fallback = "#1F2937",
): string {
  const hex = normalizeHexColor(bgColor);
  if (!hex) return fallback;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1F2937" : "#FFFFFF";
}

export const hexColorFormRule = {
  validator: (_: unknown, value: string) => {
    if (!value?.trim()) {
      return Promise.reject(new Error("Color is required"));
    }
    if (!normalizeHexColor(value)) {
      return Promise.reject(
        new Error("Enter a valid hex color (e.g. #DC2626)"),
      );
    }
    return Promise.resolve();
  },
};
