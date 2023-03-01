import { getDomainUrl, t } from "@acme/shared";
import { Divider } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";
import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/buttons";
import { Logo } from "~/components/others/logo";
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
      <div className="flex flex-auto items-center justify-center bg-gradient-to-bl  from-pink-500 to-violet-500 p-20 text-white">
        <div className="max-w-4xl">
          <h2 className="text-4xl">Welcome back.</h2>
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
            <h2 className="mb-0">{t("auth.signin.title")}</h2>
            <div className="text-sm text-slate-600">
              {t(`auth.Don't have account? `)}
              <Link href="/signup">Signup</Link>
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
          <SigninForm />
          <div className="text-sm">
            <Link href="/forgot-password">{t("auth.Forgot Password")}</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
