import { pull } from "lodash";
import { t, throwError, type WithContext } from "@acme/shared";

import { ProfileModel } from "../model";

interface Props extends WithContext {
  input: Array<string>;
}

// Remove multiple profile ids
// When we remove a user profile,
// - he can't login to this workspace anymore
// - but he can login to his other workspaces
export const remove = async ({ input, ctx }: Props) => {
  const profileModel = new ProfileModel({ ctx });

  const ids = [...input];
  let error = "";

  for (const profileId of input) {
    // attempt to delete each profile id
    // should not be able remove own profile
    // we have a separate method for that workspace.leave
    if (profileId === profileModel._currentProfile.id) {
      error = "tn.error:profile.cannotRemoveOwn";
      pull(ids, profileId);
    } else {
      const result = await profileModel.deleteOne(profileId);
      if (!result) {
        error = "tn.error:remove.failed";
        pull(ids, profileId);
      }
    }
  }

  if (input.length === 1 && error) {
    // we throw the error message
    return throwError(error);
  }

  return {
    removedIds: ids,
    warning:
      ids.length !== input.length ? t("tn.warning:remove.notAll") : undefined,
  };
};
