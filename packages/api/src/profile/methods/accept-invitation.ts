import { PROFILE_STATUS } from "@acme/db";
import {
  throwError,
  type InvitationCodeInput,
  type WithContext,
} from "@acme/shared";

import { ProfileModel } from "../model";

interface Props extends WithContext {
  input: InvitationCodeInput;
}
export const acceptInvitation = async ({ input, ctx }: Props) => {
  const profileModel = new ProfileModel({ ctx });
  const currentProfile = await profileModel.findById(
    profileModel._currentProfile.id,
  );

  if (currentProfile?.status !== PROFILE_STATUS.pending) {
    return throwError(`tn.error:profile.cannotAccept`);
  }

  if (currentProfile.invitationCode !== input.invitationCode) {
    return throwError(`tn.error:profile.invitationCodeIncorrect`);
  }

  return await profileModel.update(currentProfile.id, {
    invitationCode: null,
    status: PROFILE_STATUS.active,
  });
};
