import { PROFILE_STATUS, type Prisma, type Profile } from "@acme/db";
import {
  getObjectDifference,
  randomId,
  throwError,
  type CreateProfileInput,
  type UpdateUserProfileInput,
} from "@acme/shared";

import { RoleModel } from "~/api/role/model";
import { UserModel } from "~/api/user/model";
import { getCurrentProfileFromContext } from "~/api/utils/get-current-user-from-context";
import { WorkspaceModel } from "~/api/workspace/model";
import type { ProfileModel } from "../model";

export type ProcessDocProps = {
  input: CreateProfileInput | UpdateUserProfileInput;
  oldDoc?: Profile | null;
};

interface Props extends ProcessDocProps {
  model: ProfileModel;
}

export const processDoc = async ({ input, oldDoc, model }: Props) => {
  const isInsert = !oldDoc;
  const upd = getObjectDifference(
    input,
    oldDoc,
  ) as Prisma.ProfileUncheckedCreateInput;

  if (upd.roleId) {
    const roleModel = new RoleModel({ ctx: model._ctx });
    await roleModel.findById(upd.roleId, { shouldThrow: true });
  }
  if (upd.userId) {
    const userModel = new UserModel({ ctx: model._ctx });
    await userModel.findById(upd.userId, { shouldThrow: true });
  }

  if (isInsert) {
    const currentProfile = getCurrentProfileFromContext(model._ctx);
    const workspaceId = upd.workspaceId ?? currentProfile?.workspace?.id;

    // manually check for duplicate if manually passed
    if (upd.userId) {
      const foundProfile = await model.findByWorkspaceAndUser({
        workspaceId,
        userId: upd.userId,
      });
      if (foundProfile) {
        return throwError(`tn.error:profile.duplicate`);
      }
    }

    // check for workspaceId if manually passed
    if (upd.workspaceId) {
      const workspaceModel = new WorkspaceModel({ ctx: model._ctx });
      await workspaceModel.findById(upd.workspaceId, { shouldThrow: true });
    }

    // invitation
    if (upd.invitationCode) {
      upd.status = PROFILE_STATUS.pending;

      if (process.env.NODE_ENV !== "production") {
        upd.invitationCode = `${process.env.VERIFICATION_CODE || "123456"}`;
      }
    }
    upd.invitedBy = currentProfile?.id;

    if (!currentProfile) {
      // if no context.profile,
      // it means profile is created via signup
      // set createdBy and updatedBy to profile.id
      upd.id = randomId();
      upd.createdBy = upd.id;
      upd.updatedBy = upd.id;
      upd.invitedBy = upd.id;
      upd.status = PROFILE_STATUS.active;
    }
  }

  return upd;
};
