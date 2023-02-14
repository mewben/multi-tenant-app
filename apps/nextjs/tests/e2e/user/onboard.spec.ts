import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { getDomainUrl } from "@acme/shared";

import {
  TOAST_ERROR_DIV,
  signupAndOnboard,
  signupAndVerify,
} from "../fixtures";

test.describe("Onboard User", () => {
  test("should onboard a verified user", async ({ page }) => {
    await signupAndVerify(page);
    await page.goto("/welcome");

    const domain = faker.random.alphaNumeric(16) + faker.random.numeric(8);

    const onboardingForm = page.getByTestId("form-onboard-user");
    await onboardingForm.getByTestId("firstName").fill(faker.name.firstName());
    await onboardingForm
      .getByTestId("workspaceTitle")
      .fill(faker.random.words(2));
    await onboardingForm.getByTestId("workspaceDomain").fill(domain);
    await onboardingForm.getByTestId("btn-submit").click();

    await expect(page).toHaveURL(getDomainUrl({ domain }));
  });

  test("should show validation errors", async ({ page }) => {
    await signupAndVerify(page);
    await page.goto("/welcome");

    const onboardingForm = page.getByTestId("form-onboard-user");

    // blank
    await onboardingForm.getByTestId("btn-submit").click();
    await expect(onboardingForm.getByTestId("error-firstName")).toBeVisible();
    await expect(
      onboardingForm.getByTestId("error-workspaceTitle"),
    ).toBeVisible();
    await expect(
      onboardingForm.getByTestId("error-workspaceDomain"),
    ).toBeVisible();
  });

  test("should show toast error on duplicate domain", async ({
    page,
    browser,
  }) => {
    const res = await signupAndOnboard(browser);

    await signupAndVerify(page);
    await page.goto("/welcome");

    const onboardingForm = page.getByTestId("form-onboard-user");
    await onboardingForm.getByTestId("firstName").fill(faker.name.firstName());
    await onboardingForm
      .getByTestId("workspaceTitle")
      .fill(faker.random.words(2));
    await onboardingForm
      .getByTestId("workspaceDomain")
      .fill(res.workspaceDomain as string);
    await onboardingForm.getByTestId("btn-submit").click();

    await expect(page.locator(TOAST_ERROR_DIV)).toBeVisible();
  });
});
