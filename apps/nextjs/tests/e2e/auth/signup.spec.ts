import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { TOAST_ERROR_DIV, signup } from "../fixtures";

test.describe("Signup", () => {
  test("should successfully sign up", async ({ page }) => {
    await page.goto("/signup");
    await expect(page).toHaveTitle(/Signup.*/);

    const signupForm = page.getByTestId("form-signup");

    await signupForm.getByTestId("name").fill(faker.name.firstName());
    await signupForm.getByTestId("email").fill(faker.internet.email());
    await signupForm.getByTestId("password").fill(faker.random.alphaNumeric(6));
    await signupForm.getByTestId("btn-submit").click();

    await expect(page).toHaveURL(/verify-user\?userId=./);
  });

  test("should show validation errors", async ({ page }) => {
    await page.goto("/signup");

    const signupForm = page.getByTestId("form-signup");

    // blank
    await signupForm.getByTestId("btn-submit").click();
    await expect(signupForm.getByTestId("error-name")).toBeVisible();
    await expect(signupForm.getByTestId("error-email")).toBeVisible();
    await expect(signupForm.getByTestId("error-password")).toBeVisible();

    // email
    await signupForm.getByTestId("name").fill(faker.random.word());
    await signupForm.getByTestId("email").fill(faker.random.word());
    await signupForm
      .getByTestId("password")
      .fill(faker.random.alphaNumeric(12));
    await signupForm.getByTestId("btn-submit").click();
    await expect(signupForm.getByTestId("error-email")).toBeVisible();

    // password
    await signupForm.getByTestId("name").fill(faker.random.word());
    await signupForm.getByTestId("email").fill(faker.internet.email());
    await signupForm.getByTestId("password").fill(faker.random.alphaNumeric(5));
    await signupForm.getByTestId("btn-submit").click();
    await expect(signupForm.getByTestId("error-password")).toBeVisible();
  });

  test("should show toast error on duplicate email", async ({
    page,
    browser,
  }) => {
    const { email } = await signup(page);

    const newBrowserContext = await browser.newContext();
    const newPage = await newBrowserContext.newPage();
    await newPage.goto("/signup");

    const signupForm2 = newPage.getByTestId("form-signup");

    await signupForm2.getByTestId("name").fill(faker.name.firstName());
    await signupForm2.getByTestId("email").fill(email as string);
    await signupForm2
      .getByTestId("password")
      .fill(faker.random.alphaNumeric(6));
    await signupForm2.getByTestId("btn-submit").click();

    await expect(newPage.locator(TOAST_ERROR_DIV)).toBeVisible();
  });
});
