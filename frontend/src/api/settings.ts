import type { SettingsUpdate, SystemSettings } from "../types/settings";
import { apiClient } from "./client";

export async function getSettings(): Promise<SystemSettings> {
  const response = await apiClient.get<SystemSettings>("/settings");
  return response.data;
}

export async function updateSettings(
  payload: SettingsUpdate,
): Promise<SystemSettings> {
  const response = await apiClient.put<SystemSettings>("/settings", payload);
  return response.data;
}

export async function uploadSettingsLogo(file: File): Promise<SystemSettings> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<SystemSettings>(
    "/settings/logo",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

export async function uploadSettingsFavicon(
  file: File,
): Promise<SystemSettings> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<SystemSettings>(
    "/settings/favicon",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}
