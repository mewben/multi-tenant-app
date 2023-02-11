import type { ReactNode } from "react";
import { isEmpty } from "lodash";
import { getDomainUrl } from "@acme/shared";

import { api } from "~/utils/api";

export const CheckWorkspaceWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const check = api.workspace.check.useQuery();

  if (check.isFetching) return <>TODO: loading...</>;

  if (!isEmpty(check.data))
    return <main className="main-layout">{children}</main>;

  return (
    <div className="workspace-not-found">
      <h1>Workspace not found.</h1>
      <a href={getDomainUrl()}>Return to Main App</a>
    </div>
  );
};
