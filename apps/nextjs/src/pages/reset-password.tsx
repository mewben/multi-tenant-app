import { t } from "@acme/shared";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ResetPasswordForm } from "~/components/scenes/auth/reset-password-form";

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const email = router.query.email as string;
  const resetToken = router.query.resetToken as string;

  return (
    <>
      <h1>{t("auth.Reset Password")}</h1>
      <ResetPasswordForm email={email} resetToken={resetToken} />
      <div>
        <div>
          <Link href="/signin">{t("auth.Back to Login")}</Link>
        </div>
        <div>
          <span>{t("auth.Dont have an account?")}</span>
          <Link href="/signup">{t("auth.sign Up")}</Link>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
