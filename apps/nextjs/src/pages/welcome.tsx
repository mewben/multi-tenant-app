import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { OnboardingForm } from "~/components/scenes/user/onboarding-form";
import { WorkspacesList } from "~/components/scenes/user/workspaces-list";
import { WelcomeWrapper } from "~/components/wrappers/welcome-wrapper";

const Welcome: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome</title>
      </Head>
      <h1>Welcome</h1>
      <WelcomeWrapper
        renderEmpty={() => <OnboardingForm />}
        renderContent={(data) => <WorkspacesList list={data} />}
      />
      <div>
        <Link href="/signout">Sign out</Link>
        <Link href="/">Home page</Link>
      </div>
    </>
  );
};

export default Welcome;
