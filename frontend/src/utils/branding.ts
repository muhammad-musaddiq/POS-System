import { defaultSettingsTheme } from "../theme/settings-theme";
import type { SystemSettings } from "../types/settings";

type BrandingSettings = Pick<
  SystemSettings,
  "app_name" | "company_name" | "white_label_enabled"
>;

export interface BrandingDisplay {
  primaryLabel: string;
  secondaryLabel: string | null;
  showVersionFooter: boolean;
}

export function getBrandingDisplay(
  settings?: Partial<BrandingSettings>,
): BrandingDisplay {
  const appName = settings?.app_name?.trim() || defaultSettingsTheme.app_name;
  const companyName = settings?.company_name?.trim() || null;
  const whiteLabel = settings?.white_label_enabled ?? false;

  if (whiteLabel) {
    return {
      primaryLabel: companyName || appName,
      secondaryLabel: companyName && companyName !== appName ? appName : null,
      showVersionFooter: false,
    };
  }

  return {
    primaryLabel: appName,
    secondaryLabel: companyName || "Point of sale",
    showVersionFooter: true,
  };
}
