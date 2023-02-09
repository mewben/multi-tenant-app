import type { Prisma, Role } from "@acme/db";
import {
  getObjectDifference,
  throwError,
  type CreateRoleInput,
} from "@acme/shared";

import { getCurrentProfileFromContext } from "~/api/utils/get-current-user-from-context";
import { WorkspaceModel } from "~/api/workspace/model";
import type { RoleModel } from "../model";

export type ProcessDocProps = {
  input: CreateRoleInput;
  oldDoc?: Role;
};

interface Props extends ProcessDocProps {
  model: RoleModel;
}

export const processDoc = async ({ input, oldDoc, model }: Props) => {
  const isInsert = !oldDoc;
  const upd = getObjectDifference(
    input,
    oldDoc,
  ) as Prisma.RoleUncheckedCreateInput;

  if (isInsert) {
    const currentProfile = getCurrentProfileFromContext(model._ctx);
    const workspaceId = upd.workspaceId ?? currentProfile?.workspace?.id;

    // check for workspaceId if manually passed
    if (upd.workspaceId) {
      const workspaceModel = new WorkspaceModel({ ctx: model._ctx });
      await workspaceModel.findById(upd.workspaceId, { shouldThrow: true });
    }

    // check for duplicate
    // we explicitly do this to throw our own error message
    const foundRole = await model.findByWorkspaceAndTitle({
      workspaceId,
      title: input?.title,
    });
    if (foundRole) {
      return throwError(`tn.error:role.duplicate`);
    }
    upd.workspaceId = workspaceId;
  }

  return upd;
};
