import { t } from "@acme/shared";
import { type NextPage } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "~/components/scenes/auth/forgot-password-form";

const ForgotPassword: NextPage = () => {
  return (
    <>
      <h1>{t("auth.Forgot Password")}</h1>
      <ForgotPasswordForm />
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

export default ForgotPassword;
