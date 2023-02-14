import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { getDomainUrl } from "@acme/shared";

import { TOAST_ERROR_DIV, signupAndOnboard } from "../fixtures";

test.describe("Create Workspace", () => {
  test("should be able to create another workspace", async ({
    page,
    browser,
  }) => {
    await signupAndOnboard(browser, page);
    await page.goto("/create-workspace");

    const domain = faker.random.alphaNumeric(16) + faker.random.numeric(8);

    const createForm = page.getByTestId("form-create-workspace");
    await createForm.getByTestId("title").fill(faker.random.words(2));
    await createForm.getByTestId("domain").fill(domain);
    await createForm.getByTestId("btn-submit").click();

    await expect(page).toHaveURL(getDomainUrl({ domain }));
  });

  test("should show validation errors", async ({ browser, page }) => {
    const input = await signupAndOnboard(browser, page);
    await page.goto("/create-workspace");

    const createForm = page.getByTestId("form-create-workspace");

    // blank
    await createForm.getByTestId("btn-submit").click();
    await expect(createForm.getByTestId("error-title")).toBeVisible();
    await expect(createForm.getByTestId("error-domain")).toBeVisible();

    // min error
    await createForm.getByTestId("title").fill("a");
    await createForm.getByTestId("domain").fill("a");
    await createForm.getByTestId("btn-submit").click();
    await expect(createForm.getByTestId("error-title")).toBeVisible();
    await expect(createForm.getByTestId("error-domain")).toBeVisible();

    // duplicate
    await createForm.getByTestId("title").fill(faker.random.word());
    await createForm
      .getByTestId("domain")
      .fill(input.workspaceDomain as string);
    await createForm.getByTestId("btn-submit").click();
    await expect(page.locator(TOAST_ERROR_DIV)).toBeVisible();
  });
});
