import { App as AntApp, ConfigProvider, type ThemeConfig } from "antd";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSettings } from "../hooks/use-settings";
import type {
  BorderRadius,
  LayoutSpacing,
  SystemSettings,
} from "../types/settings";
import { AUTH_TOKEN_CHANGED_EVENT, authStorage } from "../utils/auth-storage";
import { getBrandingDisplay, type BrandingDisplay } from "../utils/branding";
import { getContrastTextColor, mixHexColors, withAlpha } from "../utils/color";

export const defaultSettingsTheme: Omit<
  SystemSettings,
  "id" | "created_at" | "updated_at"
> = {
  app_name: "POS System",
  primary_color: "#0F766E",
  secondary_color: "#334155",
  accent_color: "#047857",
  sidebar_color: "#0F172A",
  header_color: "#FFFFFF",
  background_color: "#F8FAFC",
  text_color: "#0F172A",
  success_color: "#047857",
  warning_color: "#B45309",
  error_color: "#B91C1C",
  info_color: "#0369A1",
  positive_amount_color: "#047857",
  negative_amount_color: "#B91C1C",
  warning_amount_color: "#B45309",
  neutral_amount_color: "#64748B",
  total_amount_color: "#0F766E",
  border_radius: "medium",
  layout_spacing: "comfortable",
  logo_url: null,
  favicon_url: null,
  white_label_enabled: false,
  company_name: null,
  company_email: null,
  company_phone: null,
  company_address: null,
};

export const borderRadiusMap: Record<BorderRadius, number> = {
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
};

export const layoutSpacingMap: Record<LayoutSpacing, number> = {
  compact: 16,
  comfortable: 24,
  spacious: 32,
};

export const themeColorFields = [
  { name: "primary_color" as const, label: "Primary", group: "brand" },
  { name: "secondary_color" as const, label: "Secondary", group: "brand" },
  { name: "accent_color" as const, label: "Accent", group: "brand" },
  { name: "sidebar_color" as const, label: "Sidebar", group: "layout" },
  { name: "header_color" as const, label: "Header", group: "layout" },
  { name: "background_color" as const, label: "Background", group: "layout" },
  { name: "text_color" as const, label: "Text", group: "layout" },
];

export const semanticColorFields = [
  { name: "success_color" as const, label: "Success Color" },
  { name: "warning_color" as const, label: "Warning Color" },
  { name: "error_color" as const, label: "Error Color" },
  { name: "info_color" as const, label: "Info Color" },
];

export const financialColorFields = [
  { name: "positive_amount_color" as const, label: "Positive Amount Color" },
  { name: "negative_amount_color" as const, label: "Negative Amount Color" },
  { name: "warning_amount_color" as const, label: "Warning Amount Color" },
  { name: "neutral_amount_color" as const, label: "Neutral Amount Color" },
  { name: "total_amount_color" as const, label: "Total Amount Color" },
];

export const themeDefaultFields = [
  "primary_color",
  "secondary_color",
  "accent_color",
  "sidebar_color",
  "header_color",
  "background_color",
  "text_color",
  "success_color",
  "warning_color",
  "error_color",
  "info_color",
  "positive_amount_color",
  "negative_amount_color",
  "warning_amount_color",
  "neutral_amount_color",
  "total_amount_color",
  "border_radius",
  "layout_spacing",
] as const;

export type ThemePreviewValues = Partial<
  Pick<
    SystemSettings,
    | "app_name"
    | "company_name"
    | "logo_url"
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
  >
>;

interface AppliedSettingsTheme {
  settings: Omit<SystemSettings, "id" | "created_at" | "updated_at">;
  borderRadiusPx: number;
  contentPaddingPx: number;
  headerTextColor: string;
  headerMutedTextColor: string;
  sidebarIsLight: boolean;
  sidebarTextColor: string;
  sidebarMutedTextColor: string;
  sidebarBorderColor: string;
  sidebarItemHoverBg: string;
  sidebarActiveBg: string;
  sidebarActiveTextColor: string;
  sidebarHoverTextColor: string;
  branding: BrandingDisplay;
}

const SettingsThemeContext = createContext<AppliedSettingsTheme>({
  settings: defaultSettingsTheme,
  borderRadiusPx: borderRadiusMap.medium,
  contentPaddingPx: layoutSpacingMap.comfortable,
  headerTextColor: "#1F2937",
  headerMutedTextColor: "#6B7280",
  sidebarIsLight: true,
  sidebarTextColor: "#475569",
  sidebarMutedTextColor: "#94A3B8",
  sidebarBorderColor: "#E5E7EB",
  sidebarItemHoverBg: "#F8FAFC",
  sidebarActiveBg: "#F0FDFA",
  sidebarActiveTextColor: defaultSettingsTheme.primary_color,
  sidebarHoverTextColor: defaultSettingsTheme.secondary_color,
  branding: getBrandingDisplay(defaultSettingsTheme),
});

function normalizeSettings(settings?: SystemSettings): AppliedSettingsTheme {
  const merged = { ...defaultSettingsTheme, ...settings };
  const borderRadius =
    borderRadiusMap[merged.border_radius] ?? borderRadiusMap.medium;
  const contentPadding =
    layoutSpacingMap[merged.layout_spacing] ?? layoutSpacingMap.comfortable;
  const headerTextColor = getContrastTextColor(merged.header_color);
  const sidebarIsLight =
    getContrastTextColor(merged.sidebar_color) === "#1F2937";

  return {
    settings: merged,
    borderRadiusPx: borderRadius,
    contentPaddingPx: contentPadding,
    headerTextColor,
    headerMutedTextColor:
      headerTextColor === "#FFFFFF" ? "rgba(255, 255, 255, 0.65)" : "#6B7280",
    sidebarIsLight,
    sidebarTextColor: sidebarIsLight ? "#475569" : "#E2E8F0",
    sidebarMutedTextColor: sidebarIsLight
      ? "#94A3B8"
      : "rgba(226, 232, 240, 0.65)",
    sidebarBorderColor: sidebarIsLight ? "#E5E7EB" : withAlpha("#FFFFFF", 0.1),
    sidebarItemHoverBg: sidebarIsLight
      ? "#F8FAFC"
      : mixHexColors(merged.sidebar_color, "#FFFFFF", 0.08),
    sidebarActiveBg: sidebarIsLight
      ? withAlpha(merged.primary_color, 0.06)
      : mixHexColors(merged.sidebar_color, merged.primary_color, 0.35),
    sidebarActiveTextColor: sidebarIsLight ? merged.primary_color : "#FFFFFF",
    sidebarHoverTextColor: sidebarIsLight ? merged.secondary_color : "#FFFFFF",
    branding: getBrandingDisplay(merged),
  };
}

export function useAppliedSettingsTheme() {
  return useContext(SettingsThemeContext);
}

export function SettingsThemeProvider({ children }: { children: ReactNode }) {
  const [hasToken, setHasToken] = useState(Boolean(authStorage.getToken()));
  const { data } = useSettings();
  const appliedTheme = useMemo(() => normalizeSettings(data), [data]);

  useEffect(() => {
    const syncTokenState = () => setHasToken(Boolean(authStorage.getToken()));
    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, syncTokenState);
    window.addEventListener("storage", syncTokenState);
    return () => {
      window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, syncTokenState);
      window.removeEventListener("storage", syncTokenState);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    document.title = hasToken
      ? appliedTheme.settings.app_name
      : defaultSettingsTheme.app_name;
    root.style.backgroundColor = appliedTheme.settings.background_color;
    document.body.style.backgroundColor =
      appliedTheme.settings.background_color;
    document.body.style.color = appliedTheme.settings.text_color;

    root.style.setProperty(
      "--app-primary",
      appliedTheme.settings.primary_color,
    );
    root.style.setProperty(
      "--app-secondary",
      appliedTheme.settings.secondary_color,
    );
    root.style.setProperty(
      "--app-sidebar-border",
      appliedTheme.sidebarBorderColor,
    );
    root.style.setProperty("--app-accent", appliedTheme.settings.accent_color);
    root.style.setProperty(
      "--app-success",
      appliedTheme.settings.success_color,
    );
    root.style.setProperty(
      "--app-warning",
      appliedTheme.settings.warning_color,
    );
    root.style.setProperty("--app-error", appliedTheme.settings.error_color);
    root.style.setProperty("--app-info", appliedTheme.settings.info_color);
    root.style.setProperty(
      "--app-amount-positive",
      appliedTheme.settings.positive_amount_color,
    );
    root.style.setProperty(
      "--app-amount-negative",
      appliedTheme.settings.negative_amount_color,
    );
    root.style.setProperty(
      "--app-amount-warning",
      appliedTheme.settings.warning_amount_color,
    );
    root.style.setProperty(
      "--app-amount-neutral",
      appliedTheme.settings.neutral_amount_color,
    );
    root.style.setProperty(
      "--app-amount-total",
      appliedTheme.settings.total_amount_color,
    );
    root.style.setProperty("--app-bg", appliedTheme.settings.background_color);
    root.style.setProperty("--app-text", appliedTheme.settings.text_color);
    root.style.setProperty(
      "--app-sidebar",
      appliedTheme.settings.sidebar_color,
    );
    root.style.setProperty("--app-radius", `${appliedTheme.borderRadiusPx}px`);
    root.style.setProperty(
      "--app-content-padding",
      `${appliedTheme.contentPaddingPx}px`,
    );
    root.style.setProperty(
      "--app-shadow-sm",
      "0 1px 2px rgba(15, 23, 42, 0.04)",
    );
    root.style.setProperty(
      "--app-shadow-md",
      "0 4px 16px rgba(15, 23, 42, 0.06)",
    );

    const favicon = appliedTheme.settings.favicon_url;
    if (favicon) {
      const link =
        document.querySelector<HTMLLinkElement>("link[rel~='icon']") ??
        document.head.appendChild(document.createElement("link"));
      link.rel = "icon";
      link.href = favicon;
    }
  }, [
    appliedTheme.settings.app_name,
    appliedTheme.settings.background_color,
    appliedTheme.settings.primary_color,
    appliedTheme.settings.secondary_color,
    appliedTheme.settings.accent_color,
    appliedTheme.settings.error_color,
    appliedTheme.settings.favicon_url,
    appliedTheme.settings.info_color,
    appliedTheme.settings.negative_amount_color,
    appliedTheme.settings.neutral_amount_color,
    appliedTheme.settings.positive_amount_color,
    appliedTheme.settings.sidebar_color,
    appliedTheme.settings.success_color,
    appliedTheme.settings.text_color,
    appliedTheme.settings.total_amount_color,
    appliedTheme.settings.warning_amount_color,
    appliedTheme.settings.warning_color,
    appliedTheme.borderRadiusPx,
    appliedTheme.contentPaddingPx,
    appliedTheme.sidebarBorderColor,
    hasToken,
  ]);

  const theme = useMemo<ThemeConfig>(
    () => ({
      token: {
        colorPrimary: appliedTheme.settings.primary_color,
        colorInfo: appliedTheme.settings.info_color,
        colorSuccess: appliedTheme.settings.success_color,
        colorWarning: appliedTheme.settings.warning_color,
        colorError: appliedTheme.settings.error_color,
        colorText: appliedTheme.settings.text_color,
        colorTextSecondary: "#6B7280",
        colorTextTertiary: "#9CA3AF",
        colorBgBase: appliedTheme.settings.background_color,
        colorBgContainer: "#FFFFFF",
        colorBgLayout: appliedTheme.settings.background_color,
        colorBorder: "#E5E7EB",
        colorBorderSecondary: "#F1F5F9",
        borderRadius: appliedTheme.borderRadiusPx,
        borderRadiusLG: appliedTheme.borderRadiusPx + 4,
        borderRadiusSM: Math.max(4, appliedTheme.borderRadiusPx - 2),
        fontSize: 14,
        fontSizeHeading2: 24,
        fontSizeHeading3: 18,
        fontWeightStrong: 600,
        controlHeight: 38,
        controlHeightLG: 44,
        lineHeight: 1.5,
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        boxShadowSecondary: "0 4px 16px rgba(15, 23, 42, 0.06)",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
      components: {
        Layout: {
          headerBg: appliedTheme.settings.header_color,
          siderBg: appliedTheme.settings.sidebar_color,
          bodyBg: appliedTheme.settings.background_color,
          headerColor: appliedTheme.headerTextColor,
        },
        Menu: {
          itemBg: "transparent",
          subMenuItemBg: "transparent",
          itemColor: appliedTheme.sidebarTextColor,
          itemHoverColor: appliedTheme.sidebarHoverTextColor,
          itemHoverBg: appliedTheme.sidebarItemHoverBg,
          itemSelectedColor: appliedTheme.sidebarActiveTextColor,
          itemSelectedBg: appliedTheme.sidebarActiveBg,
          darkItemBg: appliedTheme.settings.sidebar_color,
          darkSubMenuItemBg: appliedTheme.settings.sidebar_color,
          darkItemColor: appliedTheme.sidebarTextColor,
          darkItemHoverColor: appliedTheme.sidebarHoverTextColor,
          darkItemHoverBg: appliedTheme.sidebarItemHoverBg,
          darkItemSelectedColor: appliedTheme.sidebarActiveTextColor,
          darkItemSelectedBg: appliedTheme.sidebarActiveBg,
          groupTitleColor: appliedTheme.sidebarMutedTextColor,
          groupTitleFontSize: 11,
          itemHeight: 38,
          iconSize: 16,
          itemMarginInline: 8,
          itemBorderRadius: appliedTheme.borderRadiusPx,
          collapsedIconSize: 18,
        },
        Button: {
          colorPrimary: appliedTheme.settings.primary_color,
          borderRadius: appliedTheme.borderRadiusPx,
          controlHeight: 38,
          controlHeightLG: 44,
          fontWeight: 500,
          paddingInline: 16,
        },
        Table: {
          headerBg: "#F8FAFC",
          headerColor: "#6B7280",
          rowHoverBg: "#FAFBFC",
          borderColor: "#E5E7EB",
          cellPaddingBlock: 10,
          cellPaddingInline: 14,
        },
        Card: {
          borderRadiusLG: appliedTheme.borderRadiusPx + 4,
          paddingLG: 20,
          headerHeight: 52,
        },
        Input: {
          activeBorderColor: appliedTheme.settings.primary_color,
          hoverBorderColor: appliedTheme.settings.primary_color,
          borderRadius: appliedTheme.borderRadiusPx,
          controlHeight: 38,
          controlHeightLG: 44,
        },
        Select: {
          activeBorderColor: appliedTheme.settings.primary_color,
          hoverBorderColor: appliedTheme.settings.primary_color,
          borderRadius: appliedTheme.borderRadiusPx,
          controlHeight: 38,
        },
        Form: {
          labelColor: "#374151",
          labelFontSize: 14,
          verticalLabelPadding: "0 0 6px",
        },
        Modal: {
          borderRadiusLG: appliedTheme.borderRadiusPx + 4,
          headerBg: "#FFFFFF",
        },
        Drawer: {
          borderRadiusLG: appliedTheme.borderRadiusPx + 4,
        },
        Breadcrumb: {
          fontSize: 13,
          itemColor: "#6B7280",
          lastItemColor: "#374151",
        },
        Tag: {
          borderRadiusSM: Math.max(4, appliedTheme.borderRadiusPx - 2),
          defaultBg: "#F1F5F9",
          defaultColor: "#334155",
        },
        Statistic: {
          contentFontSize: 28,
        },
      },
    }),
    [appliedTheme],
  );

  return (
    <SettingsThemeContext.Provider value={appliedTheme}>
      <ConfigProvider
        theme={theme}
        select={{ showSearch: true }}
        form={{ requiredMark: true }}
      >
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </SettingsThemeContext.Provider>
  );
}

export function getThemeDefaultValues(): Pick<
  SystemSettings,
  (typeof themeDefaultFields)[number]
> {
  return {
    primary_color: defaultSettingsTheme.primary_color,
    secondary_color: defaultSettingsTheme.secondary_color,
    accent_color: defaultSettingsTheme.accent_color,
    sidebar_color: defaultSettingsTheme.sidebar_color,
    header_color: defaultSettingsTheme.header_color,
    background_color: defaultSettingsTheme.background_color,
    text_color: defaultSettingsTheme.text_color,
    success_color: defaultSettingsTheme.success_color,
    warning_color: defaultSettingsTheme.warning_color,
    error_color: defaultSettingsTheme.error_color,
    info_color: defaultSettingsTheme.info_color,
    positive_amount_color: defaultSettingsTheme.positive_amount_color,
    negative_amount_color: defaultSettingsTheme.negative_amount_color,
    warning_amount_color: defaultSettingsTheme.warning_amount_color,
    neutral_amount_color: defaultSettingsTheme.neutral_amount_color,
    total_amount_color: defaultSettingsTheme.total_amount_color,
    border_radius: defaultSettingsTheme.border_radius,
    layout_spacing: defaultSettingsTheme.layout_spacing,
  };
}
