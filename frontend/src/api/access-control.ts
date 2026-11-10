import type {
  ManagedRole,
  ManagedUser,
  PermissionGroup,
  RoleFilters,
  RoleListResponse,
  RolePayload,
  UserFilters,
  UserListResponse,
  UserPayload,
} from "../types/access-control";
import type { Permission } from "../types/auth";
import { apiClient } from "./client";

export async function getUsers(
  filters: UserFilters,
): Promise<UserListResponse> {
  const response = await apiClient.get<UserListResponse>("/users", {
    params: filters,
  });
  return response.data;
}

export async function saveUser(
  id: number | undefined,
  payload: UserPayload,
): Promise<ManagedUser> {
  const response = id
    ? await apiClient.put<ManagedUser>(`/users/${id}`, payload)
    : await apiClient.post<ManagedUser>("/users", payload);
  return response.data;
}

export async function updateUserStatus(
  id: number,
  status: "ACTIVE" | "INACTIVE",
): Promise<ManagedUser> {
  const response = await apiClient.patch<ManagedUser>(`/users/${id}/status`, {
    status,
  });
  return response.data;
}

export async function resetUserPassword(
  id: number,
  password: string,
): Promise<ManagedUser> {
  const response = await apiClient.patch<ManagedUser>(`/users/${id}/password`, {
    password,
  });
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}

export async function getRoles(
  filters: RoleFilters,
): Promise<RoleListResponse> {
  const response = await apiClient.get<RoleListResponse>("/roles", {
    params: filters,
  });
  return response.data;
}

export async function getRole(id: number): Promise<ManagedRole> {
  const response = await apiClient.get<ManagedRole>(`/roles/${id}`);
  return response.data;
}

export async function saveRole(
  id: number | undefined,
  payload: RolePayload,
): Promise<ManagedRole> {
  const response = id
    ? await apiClient.put<ManagedRole>(`/roles/${id}`, payload)
    : await apiClient.post<ManagedRole>("/roles", payload);
  return response.data;
}

export async function deleteRole(id: number): Promise<void> {
  await apiClient.delete(`/roles/${id}`);
}

export async function getPermissions(): Promise<Permission[]> {
  const response = await apiClient.get<Permission[]>("/permissions");
  return response.data;
}

export async function getGroupedPermissions(): Promise<PermissionGroup[]> {
  const response = await apiClient.get<PermissionGroup[]>(
    "/permissions/grouped",
  );
  return response.data;
}
