import { describe, expect, it } from "vitest";
import { userHasPermission, userIsAdmin } from "./permissions";
import type { User } from "../types/auth";
const user = {
  id: 1,
  roles: [{ name: "Viewer", permissions: [{ code: "settings.read" }] }],
} as User;
describe("permissions", () => {
  it("denies missing users", () =>
    expect(userHasPermission(undefined, "settings.read")).toBe(false));
  it("checks permission codes", () => {
    expect(userHasPermission(user, "settings.read")).toBe(true);
    expect(userHasPermission(user, "users.create")).toBe(false);
  });
  it("preserves the administrative role requirement", () => {
    expect(userIsAdmin(user)).toBe(false);
    expect(
      userIsAdmin({
        ...user,
        roles: [{ ...user.roles[0], name: "Super Admin" }],
      }),
    ).toBe(true);
  });
});
