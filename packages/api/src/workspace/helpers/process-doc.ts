import slug from "slug";
import type { Prisma, Workspace } from "@acme/db";
import {
  getObjectDifference,
  throwError,
  type CreateWorkspaceInput,
} from "@acme/shared";

import type { WorkspaceModel } from "../model";

export type ProcessDocProps = {
  input: CreateWorkspaceInput;
  oldDoc?: Workspace;
};

interface Props extends ProcessDocProps {
  model: WorkspaceModel;
}

export const processDoc = async ({ input, oldDoc, model }: Props) => {
  const isInsert = !oldDoc;

  const upd = getObjectDifference(
    input,
    oldDoc,
  ) as Prisma.WorkspaceUncheckedCreateInput;

  if (isInsert) {
    if (upd.domain) {
      upd.domain = slug(upd.domain);
    }

    // check for duplicate domain
    // we explicitly do this to throw our own error message
    const foundWorkspace = await model.findByDomain(upd.domain);
    if (foundWorkspace) {
      return throwError("tn.error:workspace.duplicateDomain");
    }
  }

  return upd;
};
