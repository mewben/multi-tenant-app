import { faker } from "@faker-js/faker";
import { expect, type Browser, type Page } from "@playwright/test";
import { getDomainUrl } from "@acme/shared";

const VERIFICATION_CODE = process.env.VERIFICATION_CODE || "123456";
const RESET_TOKEN = process.env.RESET_TOKEN;
const RETRY_LIMIT = 10;
const TOAST_ERROR_DIV = ".notifications-provider [role=alert]";

interface SignupResponse {
  email?: string;
  password?: string;
}

const signup = async (page: Page, counter = 0): Promise<SignupResponse> => {
  await page.goto("/signup");

  // when we have @test.com email, verificationCode is predetermined = 123456
  const email =
    faker.random.alphaNumeric(24) + faker.random.numeric(5) + "@test.com";
  const password = faker.random.alphaNumeric(6);

  const signupForm = page.getByTestId("form-signup");
  await signupForm.getByTestId("name").fill(faker.name.firstName());
  await signupForm.getByTestId("email").fill(email);
  await signupForm.getByTestId("password").fill(password);
  await signupForm.getByTestId("btn-submit").click();

  try {
    const error = page.locator(TOAST_ERROR_DIV);
    await error.waitFor({ state: "visible", timeout: 1000 });

    if (counter < RETRY_LIMIT) {
      await page.waitForSelector(TOAST_ERROR_DIV, { state: "hidden" });
      return await signup(page, counter + 1);
    } else {
      console.log("RETRY LIMIT signup");
      return {};
    }
  } catch (error) {
    // erroring this out means toast error is not visible,
    // proceed to return
    await expect(page).toHaveURL(/verify-user\?userId=./);
  }

  return { email, password };
};

const signupAndVerify = async (page: Page) => {
  const res = await signup(page);
  await page.waitForURL(/verify-user/);

  const verifyUrl = page.url() + `&verificationCode=${VERIFICATION_CODE}`;
  await page.goto(verifyUrl);
  await page.waitForURL("/welcome");
  // await page.waitForNavigation({ url: "/welcome" });

  await expect(page).toHaveURL(/app.*\/welcome/);
  return res;
};

interface OnboardResponse {
  firstName?: string;
  workspaceTitle?: string;
  workspaceDomain?: string;
}

const onboard = async (page: Page, counter = 0): Promise<OnboardResponse> => {
  const input = {
    firstName: faker.name.firstName(),
    workspaceTitle: faker.random.words(2),
    workspaceDomain: faker.random.alphaNumeric(16) + faker.random.numeric(8),
  };
  const onboardingForm = page.getByTestId("form-onboard-user");
  await onboardingForm.getByTestId("firstName").fill(input.firstName);
  await onboardingForm.getByTestId("workspaceTitle").fill(input.workspaceTitle);
  await onboardingForm
    .getByTestId("workspaceDomain")
    .fill(input.workspaceDomain);
  await onboardingForm.getByTestId("btn-submit").click();

  try {
    const error = page.locator(TOAST_ERROR_DIV);
    await error.waitFor({ state: "visible", timeout: 1000 });

    if (counter < RETRY_LIMIT) {
      await page.waitForSelector(TOAST_ERROR_DIV, { state: "hidden" });
      return await onboard(page, counter + 1);
    } else {
      console.log("RETRY LIMIT signup");
      return {};
    }
  } catch (error) {
    // erroring this out means toast error is not visible,
    // proceed to return
    const str = `${input.workspaceDomain}.*/`;
    const regex = new RegExp(str, "g");
    await expect(page).toHaveURL(regex);
  }

  return input;
};

const signupAndOnboard = async (browser: Browser, page?: Page) => {
  if (!page) {
    const newBrowserContext = await browser.newContext();
    page = await newBrowserContext.newPage();
  }
  const signupRes = await signupAndVerify(page);
  await page.goto("/welcome");

  const onboardRes = await onboard(page);

  return {
    ...signupRes,
    ...onboardRes,
    url: getDomainUrl({ domain: onboardRes.workspaceDomain }),
  };
};

export const adminPage = async (browser: Browser) => {
  const context = await browser.newContext({
    storageState: "state.admin.json",
  });
  return await context.newPage();
};

export {
  VERIFICATION_CODE,
  RESET_TOKEN,
  TOAST_ERROR_DIV,
  signup,
  signupAndVerify,
  signupAndOnboard,
};
