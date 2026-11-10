import { test, expect } from "@playwright/test";

test("sign in, manage users and roles, browse settings/help, and sign out", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await test.step("Sign in", async () => {
    await page.goto("/");
    await expect(page).toHaveURL(/login/);
    await page.getByLabel("Email address").fill(process.env.ADMIN_EMAIL!);
    await page
      .getByLabel("Password", { exact: true })
      .fill(process.env.ADMIN_PASSWORD!);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Home", exact: true }),
    ).toBeVisible();
  });
  const suffix = Date.now().toString();
  await test.step("Create and remove a role", async () => {
    await page.getByRole("menuitem", { name: "Roles", exact: true }).click();
    await page.getByRole("button", { name: "Add role" }).click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("Role name", { exact: true })
      .fill(`Member ${suffix}`);
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    const row = page.getByRole("row").filter({ hasText: `Member ${suffix}` });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: "Delete role", exact: true }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(row).toHaveCount(0);
  });
  await test.step("Create and remove a user", async () => {
    await page.getByRole("menuitem", { name: "Users", exact: true }).click();
    await page.getByRole("button", { name: "Add user" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name", { exact: true }).fill(`User ${suffix}`);
    await dialog
      .getByLabel("Email", { exact: true })
      .fill(`user-${suffix}@example.com`);
    await dialog
      .getByLabel("Password", { exact: true })
      .fill("browser-member-password");
    const roleSelect = dialog.getByRole("combobox", { name: /Role$/ });
    await roleSelect.click();
    await roleSelect.fill("Viewer");
    await page.getByTitle("Viewer", { exact: true }).last().click();
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    const row = page
      .getByRole("row")
      .filter({ hasText: `user-${suffix}@example.com` });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: "Delete user", exact: true }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(row).toHaveCount(0);
  });
  await test.step("Open settings and help", async () => {
    await page.getByRole("menuitem", { name: "Settings", exact: true }).click();
    await expect(page.getByLabel("App name", { exact: true })).toBeVisible();
    await page
      .getByRole("menuitem", { name: "Help Center", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Help Center", exact: true }),
    ).toBeVisible();
  });
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/login/);
  expect(errors).toEqual([]);
});

test("viewer navigation and settings remain read only", async ({
  page,
  request,
}) => {
  const login = await request.post("/api/v1/auth/login", {
    data: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
  });
  expect(login.ok()).toBeTruthy();
  const headers = {
    Authorization: `Bearer ${(await login.json()).access_token}`,
  };
  const roles = await (await request.get("/api/v1/roles", { headers })).json();
  const role = roles.items.find(
    (item: { name: string }) => item.name === "Viewer",
  );
  const email = `viewer-${Date.now()}@example.com`;
  const created = await request.post("/api/v1/users", {
    headers,
    data: {
      name: "Read only member",
      email,
      password: "viewer-test-password",
      role_id: role.id,
    },
  });
  expect(created.status()).toBe(201);
  const user = await created.json();
  try {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(email);
    await page
      .getByLabel("Password", { exact: true })
      .fill("viewer-test-password");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Home", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Users", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("menuitem", { name: "Roles", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("menuitem", { name: "Settings", exact: true }).click();
    await expect(page.getByLabel("App name", { exact: true })).toBeDisabled();
    await page.goto("/users");
    await expect(
      page.getByText("Access denied", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Add user" })).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Home", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await expect(
      page.getByRole("menuitem", { name: "Help Center", exact: true }).last(),
    ).toBeVisible();
  } finally {
    await request.delete(`/api/v1/users/${user.id}`, { headers });
  }
});
