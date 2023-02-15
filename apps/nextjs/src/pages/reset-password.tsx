import { t } from "@acme/shared";
import { Center, Paper } from "@mantine/core";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { DefaultLayout } from "~/components/layouts/default-layout";
import { Logo } from "~/components/others/logo";
import { ResetPasswordForm } from "~/components/scenes/auth/reset-password-form";

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const email = router.query.email as string;
  const resetToken = router.query.resetToken as string;

  return (
    <DefaultLayout>
      <Center>
        <Paper shadow="xs" radius="lg" className="w-[400px] space-y-12 p-14">
          <Logo />
          <div>
            <h2 className="mb-0">{t("auth.Reset Password")}</h2>
            <div className="text-sm opacity-75">
              <div>
                {t(`auth.Back to Signin `)}
                <Link href="/signin">{t("Back to Signin")}</Link>
              </div>
              <div>
                <span>{t("auth.Dont have an account?")}</span>
                <Link href="/signup">{t("auth.sign Up")}</Link>
              </div>
            </div>
          </div>
          <ResetPasswordForm email={email} resetToken={resetToken} />
        </Paper>
      </Center>
    </DefaultLayout>
  );
};

export default ResetPassword;
