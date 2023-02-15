import { getDomainUrl } from "@acme/shared";
import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { RESET_TOKEN, signupAndVerify, TOAST_ERROR_DIV } from "../fixtures";

test.describe("Reset Password", () => {
  test("should successfully reset a password", async ({ page }) => {
    const { email } = await signupAndVerify(page);
    await page.goto("/forgot-password");

    const forgotForm = page.getByTestId("form-forgot-password");
    await forgotForm.getByTestId("email").fill(email as string);
    await forgotForm.getByTestId("btn-submit").click();

    await expect(forgotForm).not.toBeVisible();

    // reset
    const newPassword = faker.random.alphaNumeric(12);
    await page.goto(
      `/reset-password?email=${email as string}&resetToken=${RESET_TOKEN}`,
    );
    const resetForm = page.getByTestId("form-reset-password");
    await resetForm.getByTestId("newPassword").fill(newPassword);
    await resetForm.getByTestId("btn-submit").click();

    await expect(resetForm).not.toBeVisible();

    // try signing in with new password
    await page.goto("/signin");
    const signinForm = page.getByTestId("form-signin");
    await signinForm.getByTestId("email").fill(email as string);
    await signinForm.getByTestId("password").fill(newPassword);
    await signinForm.getByTestId("btn-submit").click();

    await expect(page).toHaveURL(getDomainUrl() + "/welcome");
  });

  test("should show errors", async ({ page }) => {
    await page.goto(
      `/reset-password?email=${faker.internet.email()}&resetToken=${RESET_TOKEN}`,
    );
    const resetForm = page.getByTestId("form-reset-password");
    await resetForm
      .getByTestId("newPassword")
      .fill(faker.random.alphaNumeric(12));
    await resetForm.getByTestId("btn-submit").click();

    await expect(page.locator(TOAST_ERROR_DIV)).toBeVisible();
  });
});
