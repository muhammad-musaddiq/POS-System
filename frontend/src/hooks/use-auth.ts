import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser, login } from "../api/auth";
import type { LoginRequest } from "../types/auth";
import { authStorage } from "../utils/auth-storage";

const currentUserQueryKey = ["auth", "current-user"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    enabled: Boolean(authStorage.getToken()),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: ({ access_token, refresh_token }) => {
      authStorage.setTokens(access_token, refresh_token);
      void queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    authStorage.clearToken();
    queryClient.clear();
  };
}
