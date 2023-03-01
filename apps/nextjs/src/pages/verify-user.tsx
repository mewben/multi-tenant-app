import { t } from "@acme/shared";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Center, Paper } from "@mantine/core";
import { Logo } from "~/components/others/logo";
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
      <Center>
        <Paper shadow="xs" radius="lg" className="w-[400px] space-y-12 p-14">
          <Head>
            <title>Verify User</title>
          </Head>
          <Logo />
          <div>
            <h2 className="mb-0">{t("auth.verify.title")}</h2>
            <div className="text-sm opacity-75">
              {t(`auth.Back to Signin `)}
              <Link href="/signin">{t("Signin in to another account")}</Link>
            </div>
          </div>
          {renderContent()}
        </Paper>
      </Center>
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
