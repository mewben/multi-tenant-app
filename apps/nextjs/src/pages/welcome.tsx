import { t } from "@acme/shared";
import { Center, Paper } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Logo } from "~/components/others/logo";

import { OnboardingForm } from "~/components/scenes/user/onboarding-form";
import { WorkspacesList } from "~/components/scenes/user/workspaces-list";
import { WelcomeWrapper } from "~/components/wrappers/welcome-wrapper";

const Welcome: NextPage = () => {
  return (
    <>
      <Center>
        <Paper shadow="xs" radius="lg" className="w-[480px] space-y-12 p-14">
          <Head>
            <title>Welcome</title>
          </Head>
          <Logo />
          <div>
            <h2 className="mb-0">{t("Welcome")}</h2>
            <div className="text-sm opacity-75">
              {t(`auth.signout `)}
              <Link href="/signout">{t("Sign out")}</Link>
            </div>
          </div>
          <WelcomeWrapper
            renderEmpty={() => <OnboardingForm />}
            renderContent={(data) => <WorkspacesList list={data} />}
          />
        </Paper>
      </Center>
    </>
  );
};

export default Welcome;
