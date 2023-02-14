import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { getDomainUrl } from "@acme/shared";

import { TOAST_ERROR_DIV, signupAndOnboard } from "../fixtures";

test.describe("Signin", () => {
  test("should redirect to /welcome if logged in via main subdomain", async ({
    page,
    browser,
  }) => {
    const input = await signupAndOnboard(browser);
    await page.goto("/signin");

    const signinForm = page.getByTestId("form-signin");
    await signinForm.getByTestId("email").fill(input.email as string);
    await signinForm.getByTestId("password").fill(input.password as string);
    await signinForm.getByTestId("btn-submit").click();

    await expect(page).toHaveURL(getDomainUrl() + "/welcome");

    // should show list of workspaces
    await expect(page.locator(".workspaces-list")).toBeVisible();
  });

  test("should redirect to dashboard if logged in from their subdomain", async ({
    page,
    browser,
  }) => {
    const input = await signupAndOnboard(browser);
    await page.goto(input.url + "/signin");

    const signinForm = page.getByTestId("form-signin");
    await signinForm.getByTestId("email").fill(input.email as string);
    await signinForm.getByTestId("password").fill(input.password as string);
    await signinForm.getByTestId("btn-submit").click();

    await expect(page).toHaveURL(
      getDomainUrl({ domain: input.workspaceDomain }),
    );
  });

  test("should show validation errors", async ({ page, browser }) => {
    const input = await signupAndOnboard(browser);
    await page.goto(input.url + "/signin");

    const signinForm = page.getByTestId("form-signin");
    await signinForm.getByTestId("btn-submit").click();
    await expect(signinForm.getByTestId("error-email")).toBeVisible();
    await expect(signinForm.getByTestId("error-password")).toBeVisible();
  });

  test("should show toast error for incorrect credentials", async ({
    page,
  }) => {
    await page.goto("/signin");

    const signinForm = page.getByTestId("form-signin");
    await signinForm.getByTestId("email").fill(faker.internet.email());
    await signinForm.getByTestId("password").fill("wrongpassword");
    await signinForm.getByTestId("btn-submit").click();

    await expect(page.locator(TOAST_ERROR_DIV)).toBeVisible();
  });

  test("should show toast error if user is not found in that workspace", async ({
    page,
    browser,
  }) => {
    const input = await signupAndOnboard(browser);
    const input2 = await signupAndOnboard(browser);

    // try to signin input1 from input2
    await page.goto(
      getDomainUrl({ domain: input2.workspaceDomain }) + "/signin",
    );

    const signinForm = page.getByTestId("form-signin");
    await signinForm.getByTestId("email").fill(input.email as string);
    await signinForm.getByTestId("password").fill(input.password as string);
    await signinForm.getByTestId("btn-submit").click();

    await expect(page.locator(TOAST_ERROR_DIV)).toBeVisible();
  });
});
