import { expect, it } from "vitest";
import { getTourForUser, getPermittedTourSteps } from "./permissions";
import type { User } from "../types/auth";
it("filters tour steps by user permission", () => {
  const user = {
    id: 1,
    roles: [{ name: "Viewer", permissions: [] }],
  } as unknown as User;
  const tour = getTourForUser(user)!;
  expect(tour).not.toBeNull();
  expect(
    getPermittedTourSteps(user, tour).some(
      (step) => step.module === "settings",
    ),
  ).toBe(false);
});
