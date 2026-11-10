import {
  BellOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Progress, Typography } from "antd";

import {
  borderRadiusMap,
  defaultSettingsTheme,
  layoutSpacingMap,
  type ThemePreviewValues,
} from "../../theme/settings-theme";
import { getContrastTextColor, withAlpha } from "../../utils/color";

interface ThemePreviewProps {
  values: ThemePreviewValues;
}

export function ThemePreview({ values }: ThemePreviewProps) {
  const borderRadiusPx = borderRadiusMap[values.border_radius ?? "medium"] ?? 8;
  const contentPadding =
    layoutSpacingMap[values.layout_spacing ?? "comfortable"] ?? 24;
  const sidebarColor = values.sidebar_color ?? "#FFFFFF";
  const sidebarIsLight = getContrastTextColor(sidebarColor) === "#1F2937";
  const sidebarTextColor = sidebarIsLight ? "#475569" : "#CBD5E1";
  const sidebarMutedColor = sidebarIsLight
    ? "#94A3B8"
    : "rgba(203, 213, 225, 0.65)";
  const primary = values.primary_color ?? "#BE123C";
  const secondary = values.secondary_color ?? "#1E3A5F";
  const accent = values.accent_color ?? "#0F766E";
  const success = values.success_color ?? defaultSettingsTheme.success_color;
  const warning = values.warning_color ?? defaultSettingsTheme.warning_color;
  const error = values.error_color ?? defaultSettingsTheme.error_color;
  const info = values.info_color ?? defaultSettingsTheme.info_color;
  const positiveAmount =
    values.positive_amount_color ?? defaultSettingsTheme.positive_amount_color;
  const negativeAmount =
    values.negative_amount_color ?? defaultSettingsTheme.negative_amount_color;
  const warningAmount =
    values.warning_amount_color ?? defaultSettingsTheme.warning_amount_color;
  const neutralAmount =
    values.neutral_amount_color ?? defaultSettingsTheme.neutral_amount_color;
  const totalAmount =
    values.total_amount_color ?? defaultSettingsTheme.total_amount_color;
  const appName = values.app_name ?? "POS System";
  const activeBg = sidebarIsLight
    ? withAlpha(primary, 0.06)
    : withAlpha(primary, 0.2);
  const hoverBg = sidebarIsLight ? "#F8FAFC" : withAlpha("#FFFFFF", 0.06);

  return (
    <div className="app-theme-preview w-full max-w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div className="flex min-h-[280px] max-h-[320px]">
        <aside
          className="flex w-[96px] shrink-0 flex-col border-r"
          style={{
            backgroundColor: sidebarColor,
            borderColor: sidebarIsLight ? "#E5E7EB" : "rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="flex items-center gap-1.5 border-b px-2 py-2"
            style={{
              borderColor: sidebarIsLight ? "#E5E7EB" : "rgba(255,255,255,0.1)",
            }}
          >
            {values.logo_url ? (
              <img
                src={values.logo_url}
                alt=""
                className="size-6 shrink-0 rounded object-contain"
              />
            ) : (
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white"
                style={{ backgroundColor: primary }}
              >
                {appName.charAt(0)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div
                className="truncate text-[8px] font-semibold leading-tight"
                style={{ color: sidebarIsLight ? "#111827" : "#FFFFFF" }}
              >
                {appName}
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-0.5 p-1">
            <div
              className="flex items-center gap-1 rounded px-1.5 py-1 text-[8px] font-semibold"
              style={{
                backgroundColor: activeBg,
                color: primary,
                borderLeft: sidebarIsLight ? `2px solid ${primary}` : "none",
                paddingLeft: sidebarIsLight ? 4 : 6,
              }}
            >
              <DashboardOutlined className="text-[9px]" />
              <span className="truncate">Dashboard</span>
            </div>
            <div
              className="flex items-center gap-1 rounded px-1.5 py-1 text-[8px]"
              style={{ color: sidebarTextColor }}
            >
              <FileSearchOutlined className="text-[9px]" />
              <span className="truncate">Users</span>
            </div>
            <div
              className="flex items-center gap-1 rounded px-1.5 py-1 text-[8px]"
              style={{ color: sidebarTextColor, backgroundColor: hoverBg }}
            >
              <span className="truncate" style={{ color: secondary }}>
                Roles
              </span>
            </div>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header
            className="flex h-8 shrink-0 items-center justify-between border-b border-gray-200/80 px-2"
            style={{ backgroundColor: values.header_color ?? "#FFFFFF" }}
          >
            <Typography.Text
              className="truncate text-[8px] font-semibold"
              style={{ color: secondary }}
            >
              {values.company_name ?? "Application workspace"}
            </Typography.Text>
            <div className="flex shrink-0 items-center gap-1">
              <BellOutlined
                className="text-[9px]"
                style={{ color: secondary }}
              />
              <span
                className="flex size-3.5 items-center justify-center rounded-full text-[7px] text-white"
                style={{ backgroundColor: primary }}
              >
                <UserOutlined />
              </span>
            </div>
          </header>

          <main
            className="flex-1 overflow-hidden"
            style={{
              backgroundColor: values.background_color ?? "#F8FAFC",
              padding: Math.max(8, contentPadding / 3),
            }}
          >
            <div className="mb-1.5 grid grid-cols-3 gap-1">
              {[
                { label: "Users", value: "12", color: secondary },
                { label: "Roles", value: "4", color: primary },
                { label: "Settings", value: "3", color: accent },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 border border-gray-200/80 bg-white p-1.5 shadow-sm"
                  style={{
                    borderRadius: Math.max(4, borderRadiusPx - 2),
                    color: values.text_color,
                  }}
                >
                  <div className="truncate text-[7px] text-gray-500">
                    {stat.label}
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="border border-gray-200/80 bg-white p-2 shadow-sm"
              style={{
                borderRadius: borderRadiusPx,
                color: values.text_color ?? "#111827",
              }}
            >
              <div className="mb-1.5 flex items-center justify-between gap-1">
                <Typography.Text className="truncate text-[9px] font-semibold">
                  Component preview
                </Typography.Text>
                <span
                  className="shrink-0 rounded px-1.5 py-0.5 text-[7px] font-semibold"
                  style={{
                    color: success,
                    backgroundColor: withAlpha(success, 0.1),
                    border: `1px solid ${withAlpha(success, 0.25)}`,
                  }}
                >
                  Preview
                </span>
              </div>
              <div className="mb-1 flex justify-between text-[7px] text-gray-500">
                <span className="truncate">Progress example</span>
                <span className="shrink-0">50%</span>
              </div>
              <Progress
                percent={50}
                size="small"
                strokeColor={primary}
                showInfo={false}
              />
            </div>

            <div className="mt-1.5 grid grid-cols-3 gap-1 text-[7px] font-semibold">
              {[
                { label: "Positive", value: "+100", color: positiveAmount },
                { label: "Negative", value: "-20", color: negativeAmount },
                { label: "Total", value: "80", color: totalAmount },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-0 truncate rounded border border-gray-200 bg-white px-1.5 py-1"
                  style={{ color: item.color }}
                >
                  {item.value}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 border-t border-gray-100 bg-gray-50 px-2.5 py-2">
        {[
          { label: "Success", color: success },
          { label: "Warning", color: warning },
          { label: "Error", color: error },
          { label: "Info", color: info },
        ].map((item) => (
          <div key={item.label} className="min-w-0 text-center">
            <div
              className="mx-auto mb-0.5 size-5 rounded border border-gray-200 shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <Typography.Text className="block truncate text-[8px] font-medium text-gray-600">
              {item.label}
            </Typography.Text>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1 border-t border-gray-100 bg-white px-2.5 py-2">
        {[
          { label: "Positive", color: positiveAmount },
          { label: "Negative", color: negativeAmount },
          { label: "Warning", color: warningAmount },
          { label: "Neutral", color: neutralAmount },
          { label: "Total", color: totalAmount },
        ].map((item) => (
          <div key={item.label} className="min-w-0 text-center">
            <div
              className="mx-auto mb-0.5 size-4 rounded border border-gray-200 shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <Typography.Text className="block truncate text-[7px] font-medium text-gray-600">
              {item.label}
            </Typography.Text>
          </div>
        ))}
      </div>
    </div>
  );
}
