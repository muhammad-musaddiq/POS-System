import { expect, it } from "vitest";
import {
  helpDocuments,
  getDefaultHelpDocument,
  isDeveloperDocument,
} from "./documentRegistry";
it("provides a starter guide without developer sections by default", () => {
  expect(getDefaultHelpDocument()?.path).toBe(
    "/docs/workflows/getting-started.md",
  );
  expect(helpDocuments.length).toBeGreaterThan(0);
  expect(helpDocuments.some(isDeveloperDocument)).toBe(false);
});
