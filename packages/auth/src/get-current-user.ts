import { t, type WithContext } from "@acme/shared";

interface Props extends WithContext {
  userId?: string;
}

export const getCurrentUser = async ({ userId, ctx }: Props) => {
  if (!userId) return undefined;

  const d = t("something");

  console.log("melvinsoldia", d);

  return undefined;
};
