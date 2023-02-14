import { expect, test } from "@playwright/test";
import { getDomainUrl } from "@acme/shared";

import { TOAST_ERROR_DIV, VERIFICATION_CODE, signup } from "../fixtures";

test.describe("Verify User", () => {
  test("should successfully verify a user", async ({ page }) => {
    await signup(page);
    await page.waitForURL(/verify-user/);

    // this will be redirected to '/verify-user?userId=xxxx'
    const verifyForm = page.getByTestId("form-verify-user");
    await verifyForm.getByTestId("verificationCode").fill(VERIFICATION_CODE);
    await verifyForm.getByTestId("btn-submit").click();

    await expect(page).toHaveURL(getDomainUrl() + "/welcome");
    await expect(page.getByTestId("form-onboard-user")).toBeVisible();
  });

  test("should autoverify a user when code is passed in the url", async ({
    page,
  }) => {
    await signup(page);
    await page.waitForURL(/verify-user/);

    const verifyUrl = page.url() + `&verificationCode=${VERIFICATION_CODE}`;

    await page.goto(verifyUrl);
    await page.waitForNavigation({ url: "/welcome" });

    await expect(page).toHaveURL(/app.*\/welcome/);
  });

  test("should show validation errors", async ({ page }) => {
    await signup(page);
    await page.waitForURL(/verify-user/);

    const verifyForm = page.getByTestId("form-verify-user");

    // blank
    await verifyForm.getByTestId("btn-submit").click();
    await expect(
      verifyForm.getByTestId("error-verificationCode"),
    ).toBeVisible();
  });

  test("should show toast error on incorrect verificationCode", async ({
    page,
  }) => {
    await signup(page);
    await page.waitForURL(/verify-user/);

    const verifyForm = page.getByTestId("form-verify-user");
    await verifyForm.getByTestId("verificationCode").fill("wrongk");
    await verifyForm.getByTestId("btn-submit").click();

    await expect(page.locator(TOAST_ERROR_DIV)).toBeVisible();
  });
});
