import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getSettings,
  updateSettings,
  uploadSettingsFavicon,
  uploadSettingsLogo,
} from "../api/settings";
import type { SettingsUpdate } from "../types/settings";
import { authStorage } from "../utils/auth-storage";

export const settingsQueryKey = ["settings"] as const;

export function useSettings() {
  return useQuery({
    queryKey: settingsQueryKey,
    queryFn: getSettings,
    enabled: Boolean(authStorage.getToken()),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SettingsUpdate) => updateSettings(payload),
    onSuccess: (settings) => {
      queryClient.setQueryData(settingsQueryKey, settings);
    },
  });
}

export function useUploadSettingsLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadSettingsLogo(file),
    onSuccess: (settings) => {
      queryClient.setQueryData(settingsQueryKey, settings);
    },
  });
}

export function useUploadSettingsFavicon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadSettingsFavicon(file),
    onSuccess: (settings) => {
      queryClient.setQueryData(settingsQueryKey, settings);
    },
  });
}
