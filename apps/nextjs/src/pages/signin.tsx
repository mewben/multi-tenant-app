import { getDomainUrl, t } from "@acme/shared";
import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SigninForm } from "~/components/scenes/auth/signin-form";

const Signin: NextPage = () => {
  const [discordLink, setDiscordLink] = useState("");

  useEffect(() => {
    setDiscordLink(
      getDomainUrl() +
        "/callback?action=signin&provider=discord&redirect_uri=" +
        window.location.origin,
    );
  }, []);

  return (
    <>
      <h1>{t("auth.signin.title")}</h1>
      <SigninForm />
      <div>
        <Link href="/signup">Signup</Link>
        <Link href={discordLink}>Sign In (Discord)</Link>
        <Link href="/">Home page</Link>
      </div>
    </>
  );
};

export default Signin;
