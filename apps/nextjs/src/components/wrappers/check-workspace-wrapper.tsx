import { getDomainUrl } from "@acme/shared";
import type { ReactNode } from "react";

import { api } from "~/utils/api";

export const CheckWorkspaceWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const check = api.workspace.check.useQuery();

  if (check.isLoading) return <>TODO: loading...</>;

  if (!check.data) {
    return (
      <div className="workspace-not-found">
        <h1>Workspace not found.</h1>
        <a href={getDomainUrl()}>Return to Main App</a>
      </div>
    );
  }

  return <>{children}</>;
};
