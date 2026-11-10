import type { ReactNode } from "react";
import { useCurrentUser } from "../hooks/use-auth";
import { userHasPermission } from "../utils/permissions";
export function PermissionAction({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { data: user } = useCurrentUser();
  return userHasPermission(user, permission) ? children : null;
}
