import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteRole,
  deleteUser,
  getGroupedPermissions,
  getRole,
  getRoles,
  getUsers,
  resetUserPassword,
  saveRole,
  saveUser,
  updateUserStatus,
} from "../api/access-control";
import type {
  RoleFilters,
  RolePayload,
  UserFilters,
  UserPayload,
} from "../types/access-control";

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    placeholderData: (previous) => previous,
  });
}

export function useSaveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: UserPayload }) =>
      saveUser(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      void queryClient.invalidateQueries({
        queryKey: ["auth", "current-user"],
      });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "ACTIVE" | "INACTIVE";
    }) => updateUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      resetUserPassword(id, password),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useRoles(filters: RoleFilters) {
  return useQuery({
    queryKey: ["roles", filters],
    queryFn: () => getRoles(filters),
    placeholderData: (previous) => previous,
  });
}

export function useRole(id: number | undefined) {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => getRole(id as number),
    enabled: Boolean(id),
  });
}

export function useSaveRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: RolePayload }) =>
      saveRole(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["roles"] });
      void queryClient.invalidateQueries({
        queryKey: ["auth", "current-user"],
      });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useGroupedPermissions() {
  return useQuery({
    queryKey: ["permissions", "grouped"],
    queryFn: getGroupedPermissions,
    staleTime: 10 * 60 * 1000,
  });
}
