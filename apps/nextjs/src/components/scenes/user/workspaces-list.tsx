import React from "react";
import Link from "next/link";
import { map } from "lodash";
import { getDomainUrl, t } from "@acme/shared";

import { RouterOutputs } from "~/utils/api";

interface Props {
  list: RouterOutputs["workspace"]["list"];
}

export const WorkspacesList = ({ list }: Props) => {
  return (
    <div>
      <h2>{t("Select workspace")}</h2>
      <div className="workspaces-list">
        {map(list, (profile) => {
          const url = getDomainUrl(profile?.workspace);
          return (
            <div key={profile.id}>
              <a href={url}>{profile?.workspace?.title}</a>
            </div>
          );
        })}
      </div>
      <Link href="/create-workspace">{t("workspace.create")}</Link>
      <hr />
    </div>
  );
};
