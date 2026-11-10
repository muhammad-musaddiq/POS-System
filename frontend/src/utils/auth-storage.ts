import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants/auth";

export const AUTH_TOKEN_CHANGED_EVENT = "auth-token-changed";

function notifyAuthTokenChanged(): void {
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGED_EVENT));
}

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    notifyAuthTokenChanged();
  },
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    notifyAuthTokenChanged();
  },
  clearToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    notifyAuthTokenChanged();
  },
};
