import { getDomainUrl, t } from "@acme/shared";
import { Divider } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/buttons";
import { DefaultLayout } from "~/components/layouts/default-layout";
import { Logo } from "~/components/others/logo";
import { SignupForm } from "~/components/scenes/auth/signup-form";

const Signup: NextPage = () => {
  const [discordLink, setDiscordLink] = useState("");

  useEffect(() => {
    setDiscordLink(
      getDomainUrl() +
        "/callback?action=signin&provider=discord&redirect_uri=" +
        window.location.origin,
    );
  }, []);

  return (
    <DefaultLayout>
      <Head>
        <title>Signup</title>
      </Head>
      <div className="flex flex-auto items-center justify-center bg-gradient-to-bl  from-pink-500 to-violet-500 p-20 text-white">
        <div className="max-w-4xl">
          <h2 className="text-4xl">Welcome.</h2>
          <div className="opacity-75">
            A professional kit that comes with ready-to-use MUI components
            developed with one common goal in mind, help you build faster &
            beautiful applications.
          </div>
        </div>
      </div>
      <div className="flex w-[600px] flex-auto flex-col justify-center p-24">
        <div className="space-y-12">
          <Logo />
          <div>
            <h2 className="mb-0">{t("auth.signup.title")}</h2>
            <div className="text-sm text-slate-600">
              {t(`auth.Already have an account? `)}
              <Link href="/signin">Signin instead</Link>
            </div>
          </div>
          <div>
            <Button
              component={Link}
              href={discordLink}
              leftIcon={<IconBrandDiscord />}
              variant="outline"
              color="dark"
              fullWidth
              className="btn-link"
            >
              {t("btn.Continue with Discord")}
            </Button>
          </div>
          <Divider my="xs" label="or" labelPosition="center" />
          <SignupForm />
        </div>
      </div>
    </DefaultLayout>
  );

  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>
      <h1>Signup</h1>
      <SignupForm />
      <div>
        <Link href="/signin">Signin</Link>
        <Link href="/">Home page</Link>
      </div>
    </>
  );
};

export default Signup;
