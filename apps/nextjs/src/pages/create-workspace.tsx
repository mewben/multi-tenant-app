import { t } from "@acme/shared";
import { type NextPage } from "next";
import Head from "next/head";

import { Center, Paper } from "@mantine/core";
import Link from "next/link";
import { Logo } from "~/components/others/logo";
import { CreateWorkspaceForm } from "~/components/scenes/user/create-workspace-form";

const CreateWorkspace: NextPage = () => {
  const title = t("Create new Workspace");

  return (
    <>
      <Center>
        <Paper shadow="xs" radius="lg" className="w-[480px] space-y-12 p-14">
          <Head>
            <title>{title}</title>
          </Head>
          <Logo />
          <div>
            <h2 className="mb-0">{t("Create Workspace")}</h2>
            <div className="text-sm opacity-75">
              <Link href="/">{t("Back")}</Link>
            </div>
          </div>
          <CreateWorkspaceForm />
        </Paper>
      </Center>
    </>
  );
};

export default CreateWorkspace;
