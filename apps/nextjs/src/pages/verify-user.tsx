import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { t } from "@acme/shared";

import { VerifyUserForm } from "~/components/scenes/user/verify-user-form";

const VerifyUser: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const verificationCode = router.query.verificationCode as string;

  const renderContent = () => {
    if (!userId) {
      return <UserNotFound />;
    }

    return (
      <VerifyUserForm userId={userId} verificationCode={verificationCode} />
    );
  };

  return (
    <>
      <Head>
        <title>Verify User</title>
      </Head>
      <div>
        <h1>{t("auth.verify.title")}</h1>
        {renderContent()}

        <div>
          <span>{t("auth.Already have an account?")}</span>
          <Link href={"/signin"}>{t("auth.Login")}</Link>
          <span>{t("auth.noAccount")}</span>
          <Link href={"/signup"}>{t("auth.signup.btn")}</Link>
        </div>
      </div>
    </>
  );
};

const UserNotFound = () => {
  return (
    <div>
      <h2>Ooops</h2>
      <p>userId not found in the url</p>
      <Link href={"/signin"}>Go to Login</Link>
    </div>
  );
};

export default VerifyUser;
