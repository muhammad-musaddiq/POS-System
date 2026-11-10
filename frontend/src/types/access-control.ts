import type { Permission, Role, User } from "./auth";
import type { PaginatedResponse } from "./api";

export interface ManagedUser extends User {
  name: string;
  role_id: number | null;
  created_at: string;
}

export interface UserFilters {
  search?: string;
  role_id?: number;
  status?: "ACTIVE" | "INACTIVE";
  page: number;
  page_size: number;
}

export type UserListResponse = PaginatedResponse<ManagedUser>;

export interface UserPayload {
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  role_id: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface ManagedRole extends Role {
  description: string | null;
  is_system_role: boolean;
  status: "ACTIVE" | "INACTIVE";
  users_count: number;
  permissions_count: number;
  created_at: string;
}

export interface RoleFilters {
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  page: number;
  page_size: number;
}

export type RoleListResponse = PaginatedResponse<ManagedRole>;

export interface RolePayload {
  name: string;
  description?: string | null;
  permission_ids: number[];
  status?: "ACTIVE" | "INACTIVE";
}

export interface PermissionGroup {
  module: string;
  label: string;
  permissions: Permission[];
}
