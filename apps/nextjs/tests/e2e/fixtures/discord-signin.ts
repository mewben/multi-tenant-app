import { expect, type Page } from "@playwright/test";
import { getDomainUrl } from "@acme/shared";

export const discordSignin = async (page: Page, origin = getDomainUrl()) => {
  await page.goto(
    `${origin}/callback?action=signin&provider=discord&redirect_uri=${origin}`,
  );
  await page
    .locator('input[name="email"]')
    .fill(process.env.DISCORD_SAMPLE_USER as string);
  await page
    .locator('input[name="password"]')
    .fill(process.env.DISCORD_SAMPLE_PASSWORD as string);
  await page.locator('button[type="submit"]').click();

  await page.getByRole("button", { name: "Authorize" }).click();

  await expect(page).toHaveURL(origin);
};
