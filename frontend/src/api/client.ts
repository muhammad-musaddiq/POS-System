import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { authStorage } from "../utils/auth-storage";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";
let refreshPromise: Promise<string> | null = null;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20_000,
  headers: {
    "Content-Type": "application/json",
  },
});

function redirectToLogin(): void {
  authStorage.clearToken();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${apiBaseUrl}/auth/refresh`,
        { refresh_token: refreshToken },
        {
          timeout: 20_000,
          headers: { "Content-Type": "application/json" },
        },
      )
      .then((response) => {
        const accessToken = response.data.access_token as string;
        const nextRefreshToken = response.data.refresh_token as string;
        authStorage.setTokens(accessToken, nextRefreshToken);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  },
);
