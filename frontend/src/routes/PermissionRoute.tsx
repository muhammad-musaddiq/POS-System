import { Result, Spin } from "antd";
import type { ReactNode } from "react";

import { useCurrentUser } from "../hooks/use-auth";
import {
  userHasAllPermissions,
  userHasAnyPermission,
  userIsAdmin,
} from "../utils/permissions";

interface PermissionRouteProps {
  permission?: string;
  permissions?: string[];
  mode?: "any" | "all";
  children: ReactNode;
}

export function PermissionRoute({
  permission,
  permissions,
  mode = "any",
  children,
}: PermissionRouteProps) {
  const currentUser = useCurrentUser();
  const requiredPermissions = permissions ?? (permission ? [permission] : []);

  if (currentUser.isPending) {
    return <Spin size="large" className="mt-20 block" />;
  }

  const adminOnly = requiredPermissions.some((code) =>
    /^(users|roles|permissions)\./.test(code),
  );
  if (adminOnly && !userIsAdmin(currentUser.data))
    return <Result status="403" title="Access denied" />;

  const isAllowed =
    requiredPermissions.length === 0 ||
    (mode === "all"
      ? userHasAllPermissions(currentUser.data, requiredPermissions)
      : userHasAnyPermission(currentUser.data, requiredPermissions));

  if (!isAllowed) {
    return (
      <Result
        status="403"
        title="Access denied"
        subTitle="You do not have permission to open this page."
      />
    );
  }

  return children;
}
