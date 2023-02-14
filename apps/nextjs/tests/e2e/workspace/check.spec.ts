import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { getDomainUrl } from "@acme/shared";

import { signupAndOnboard } from "../fixtures";

test.describe("Check Workspace", () => {
  test("should show children if workspace is found", async ({
    page,
    browser,
  }) => {
    const res = await signupAndOnboard(browser);
    await page.goto(getDomainUrl({ domain: res.workspaceDomain }));
    await expect(page.locator(".main-layout")).toBeVisible();
  });

  test("should show children on main subdomain", async ({ page }) => {
    await page.goto(getDomainUrl());
    await expect(page.locator(".main-layout")).toBeVisible();
  });

  test("should show workspace not found on non-existing workspace", async ({
    page,
  }) => {
    await page.goto(getDomainUrl({ domain: faker.random.alphaNumeric(8) }));
    await expect(page.locator(".workspace-not-found")).toBeVisible();
  });
});
