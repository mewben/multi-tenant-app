import { t } from "@acme/shared";
import { Center, Paper } from "@mantine/core";
import { type NextPage } from "next";
import Link from "next/link";
import { DefaultLayout } from "~/components/layouts/default-layout";
import { Logo } from "~/components/others/logo";
import { ForgotPasswordForm } from "~/components/scenes/auth/forgot-password-form";

const ForgotPassword: NextPage = () => {
  return (
    <DefaultLayout>
      <Center>
        <Paper shadow="xs" radius="lg" className="w-[400px] space-y-12 p-14">
          <Logo />
          <div>
            <h2 className="mb-0">{t("auth.Forgot Password")}</h2>
            <div className="text-sm opacity-75">
              {t(`auth.Back to Signin `)}
              <Link href="/signin">{t("Back to Signin")}</Link>
            </div>
          </div>
          <ForgotPasswordForm />
          <div className="text-sm">
            <span>{t("auth.Dont have an account?")}</span>
            <Link href="/signup">{t("auth.sign Up")}</Link>
          </div>
        </Paper>
      </Center>
    </DefaultLayout>
  );
};

export default ForgotPassword;
