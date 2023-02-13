import { type NextPage } from "next";
import Head from "next/head";
import { t } from "@acme/shared";

import { CreateWorkspaceForm } from "~/components/scenes/user/create-workspace-form";

const CreateWorkspace: NextPage = () => {
  const title = t("Create new Workspace");

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <CreateWorkspaceForm />
    </>
  );
};

export default CreateWorkspace;
