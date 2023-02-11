import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { OnboardingForm } from "~/components/forms/user/onboarding-form";

const Welcome: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome</title>
      </Head>
      <h1>Welcome</h1>
      TODO: show onboarding if not onboarded else show workspaces
      <OnboardingForm />
      <div>
        <Link href="/signout">Sign out</Link>
        <Link href="/">Home page</Link>
      </div>
    </>
  );
};

export default Welcome;
