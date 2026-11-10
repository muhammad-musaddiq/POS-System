import { expect, it } from "vitest";
import { authStorage } from "./auth-storage";
it("stores and clears both session tokens", () => {
  authStorage.setTokens("access", "refresh");
  expect(authStorage.getToken()).toBe("access");
  expect(authStorage.getRefreshToken()).toBe("refresh");
  authStorage.clearToken();
  expect(authStorage.getToken()).toBeNull();
  expect(authStorage.getRefreshToken()).toBeNull();
});
