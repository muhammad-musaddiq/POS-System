import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLogo } from "./AppLogo";
import { navigationItems } from "../constants/navigation";
import { useCurrentUser } from "../hooks/use-auth";
import { userHasPermission, userIsAdmin } from "../utils/permissions";
export function AppSidebar({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { data: user } = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const items = navigationItems.filter(
    (item) =>
      (!item.permission || userHasPermission(user, item.permission)) &&
      (!item.adminOnly || userIsAdmin(user)),
  );
  return (
    <aside>
      <div className="p-4">
        <AppLogo collapsed={collapsed} />
      </div>
      <nav data-tour-id="sidebar-navigation">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items.map(({ key, label }) => ({ key, label }))}
          onClick={({ key }) => {
            navigate(key);
            onNavigate?.();
          }}
        />
      </nav>
    </aside>
  );
}
