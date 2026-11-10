import { ToolOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import { useAppliedSettingsTheme } from "../theme/settings-theme";

interface AppLogoProps {
  collapsed?: boolean;
  inverse?: boolean;
}

export function AppLogo({ collapsed = false, inverse = false }: AppLogoProps) {
  const {
    settings,
    borderRadiusPx,
    branding,
    sidebarMutedTextColor,
    sidebarTextColor,
  } = useAppliedSettingsTheme();
  const titleColor = inverse ? "#FFFFFF" : sidebarTextColor;
  const subtitleColor = inverse
    ? "rgba(255, 255, 255, 0.65)"
    : sidebarMutedTextColor;
  const markRadius = Math.max(borderRadiusPx, 6);
  const hasLogo = Boolean(settings.logo_url);

  const fallbackMark = (
    <span
      className="app-sidebar-logo__mark flex size-8 shrink-0 items-center justify-center"
      style={{
        borderRadius: markRadius,
        backgroundColor: inverse ? "#FFFFFF" : settings.primary_color,
        color: inverse ? settings.primary_color : "#FFFFFF",
      }}
    >
      <ToolOutlined className="text-base" />
    </span>
  );

  const fallbackText = (
    <div className="app-sidebar-logo__text">
      <div
        className="truncate text-sm font-semibold tracking-tight"
        style={{ color: titleColor }}
      >
        {branding.primaryLabel}
      </div>
      {branding.secondaryLabel && (
        <div
          className="truncate text-[10px] font-medium"
          style={{ color: subtitleColor }}
        >
          {branding.secondaryLabel}
        </div>
      )}
    </div>
  );

  const logoContent = (
    <div
      className={`app-sidebar-logo ${
        collapsed ? "app-sidebar-logo--collapsed" : "app-sidebar-logo--expanded"
      } ${!collapsed && hasLogo ? "app-sidebar-logo--image-only" : ""}`}
    >
      {hasLogo ? (
        <img
          src={settings.logo_url!}
          alt={branding.primaryLabel}
          className="app-sidebar-logo__image"
          draggable={false}
        />
      ) : collapsed ? (
        fallbackMark
      ) : (
        <>
          {fallbackMark}
          {fallbackText}
        </>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <Tooltip title={branding.primaryLabel} placement="right">
        {logoContent}
      </Tooltip>
    );
  }

  return logoContent;
}
