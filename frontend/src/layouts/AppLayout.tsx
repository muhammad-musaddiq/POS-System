import { Drawer, Layout } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { AppHeader } from "../components/AppHeader";
import { AppSidebar } from "../components/AppSidebar";
import { useAppliedSettingsTheme } from "../theme/settings-theme";
import { TourProvider } from "../tours/TourProvider";

const { Content, Sider } = Layout;

export function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { contentPaddingPx, settings, sidebarBorderColor } =
    useAppliedSettingsTheme();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <TourProvider>
      <Layout
        className="min-h-screen"
        style={{ backgroundColor: settings.background_color }}
      >
        <Sider
          className="app-sidebar hidden min-h-screen border-r lg:block"
          width={260}
          collapsedWidth={72}
          collapsed={collapsed}
          trigger={null}
          theme="light"
          style={{
            background: settings.sidebar_color,
            borderColor: sidebarBorderColor,
          }}
        >
          <AppSidebar collapsed={collapsed} />
        </Sider>

        <Drawer
          open={mobileOpen}
          placement="left"
          size={280}
          closable={false}
          styles={{
            body: { padding: 0, background: settings.sidebar_color },
            header: { display: "none" },
          }}
          onClose={() => setMobileOpen(false)}
        >
          <AppSidebar
            collapsed={false}
            onNavigate={() => setMobileOpen(false)}
          />
        </Drawer>

        <Layout
          className="min-w-0"
          style={{ backgroundColor: settings.background_color }}
        >
          <AppHeader
            collapsed={collapsed}
            onToggleSidebar={() => {
              if (window.matchMedia("(min-width: 1024px)").matches) {
                setCollapsed((value) => !value);
              } else {
                setMobileOpen(true);
              }
            }}
          />
          <Content className="min-w-0" style={{ padding: contentPaddingPx }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </TourProvider>
  );
}
