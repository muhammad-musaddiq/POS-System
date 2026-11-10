import { Flex, Spin } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useCurrentUser } from "../hooks/use-auth";
import { authStorage } from "../utils/auth-storage";

export function ProtectedRoute() {
  const location = useLocation();
  const token = authStorage.getToken();
  const currentUser = useCurrentUser();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (currentUser.isPending) {
    return (
      <Flex
        align="center"
        justify="center"
        className="min-h-screen bg-[#f3f5f7]"
      >
        <Spin size="large" />
      </Flex>
    );
  }

  if (currentUser.isError) {
    authStorage.clearToken();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
