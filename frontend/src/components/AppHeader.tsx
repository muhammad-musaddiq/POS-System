import { Button, Space, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCurrentUser, useLogout } from "../hooks/use-auth";
import { useTour } from "../tours/useTour";
export function AppHeader({
  onToggleSidebar,
}: {
  collapsed: boolean;
  onToggleSidebar: () => void;
}) {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const tour = useTour();
  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3">
      <Button
        icon={<MenuOutlined />}
        aria-label="Toggle navigation"
        onClick={onToggleSidebar}
      />
      <Space wrap>
        <Typography.Text>{user?.full_name}</Typography.Text>
        <Button onClick={() => tour.startTour({ manual: true, level: "full" })}>
          Start tour
        </Button>
        <Button
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Sign out
        </Button>
      </Space>
    </header>
  );
}
