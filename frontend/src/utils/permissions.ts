import type { User } from "../types/auth";

export function userHasPermission(
  user: User | undefined,
  permissionCode: string,
): boolean {
  if (!user) {
    return false;
  }
  return user.roles.some((role) =>
    role.permissions.some((permission) => permission.code === permissionCode),
  );
}

export function userHasAnyPermission(
  user: User | undefined,
  permissionCodes: string[],
): boolean {
  return permissionCodes.some((permissionCode) =>
    userHasPermission(user, permissionCode),
  );
}

export function userHasAllPermissions(
  user: User | undefined,
  permissionCodes: string[],
): boolean {
  return permissionCodes.every((permissionCode) =>
    userHasPermission(user, permissionCode),
  );
}

export function userIsAdmin(user: User | undefined): boolean {
  return Boolean(
    user?.roles.some((role) => ["Super Admin", "Admin"].includes(role.name)),
  );
}
