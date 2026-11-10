export type LayoutSpacing = "compact" | "comfortable" | "spacious";
export type BorderRadius = "none" | "small" | "medium" | "large";

export interface SystemSettings {
  id: number;
  app_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  sidebar_color: string;
  header_color: string;
  background_color: string;
  text_color: string;
  success_color: string;
  warning_color: string;
  error_color: string;
  info_color: string;
  positive_amount_color: string;
  negative_amount_color: string;
  warning_amount_color: string;
  neutral_amount_color: string;
  total_amount_color: string;
  border_radius: BorderRadius;
  layout_spacing: LayoutSpacing;
  logo_url: string | null;
  favicon_url: string | null;
  white_label_enabled: boolean;
  company_name: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  created_at: string;
  updated_at: string;
}

export type SettingsUpdate = Partial<
  Pick<
    SystemSettings,
    | "app_name"
    | "primary_color"
    | "secondary_color"
    | "accent_color"
    | "sidebar_color"
    | "header_color"
    | "background_color"
    | "text_color"
    | "success_color"
    | "warning_color"
    | "error_color"
    | "info_color"
    | "positive_amount_color"
    | "negative_amount_color"
    | "warning_amount_color"
    | "neutral_amount_color"
    | "total_amount_color"
    | "border_radius"
    | "layout_spacing"
    | "logo_url"
    | "favicon_url"
    | "white_label_enabled"
    | "company_name"
    | "company_email"
    | "company_phone"
    | "company_address"
  >
>;
