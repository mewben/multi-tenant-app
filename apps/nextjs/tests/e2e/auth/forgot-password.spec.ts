import { expect, test } from "@playwright/test";

import { signup, TOAST_ERROR_DIV } from "../fixtures";

test.describe("Forgot Password", () => {
  test("should successfully forget a password", async ({ page }) => {
    const { email } = await signup(page);
    await page.goto("/forgot-password");

    const forgotForm = page.getByTestId("form-forgot-password");
    await forgotForm.getByTestId("email").fill(email as string);
    await forgotForm.getByTestId("btn-submit").click();

    await expect(forgotForm).not.toBeVisible();
  });

  test("should show errors", async ({ page }) => {
    await page.goto("/forgot-password");
    const forgotForm = page.getByTestId("form-forgot-password");
    await forgotForm.getByTestId("btn-submit").click();
    await expect(forgotForm.getByTestId("error-email")).toBeVisible();

    await forgotForm.getByTestId("email").fill("invalidemail");
    await forgotForm.getByTestId("btn-submit").click();
    await expect(forgotForm.getByTestId("error-email")).toBeVisible();

    await forgotForm.getByTestId("email").fill("notfoundemail@alksjdflk.com");
    await forgotForm.getByTestId("btn-submit").click();
    await expect(page.locator(TOAST_ERROR_DIV)).toBeVisible();
  });
});
