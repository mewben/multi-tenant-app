import {
  randomCuid,
  type CreateUserProfileInput,
  type WithContext,
} from "@acme/shared";

import { createProfile } from "~/api/profile/helpers/create-profile";
import { createUser } from "~/api/user/helpers/create-user";
import { UserModel } from "~/api/user/model";

interface Props extends WithContext {
  input: CreateUserProfileInput;
}
// this method creates a workspace user profile
// with/without invitation
export const create = async ({ input, ctx }: Props) => {
  const oldTx = ctx.tx;
  return await ctx.prisma.$transaction(async (tx) => {
    ctx.tx = oldTx ?? tx;

    // create user if email not found
    const userModel = new UserModel({ ctx });
    let foundUser = await userModel.findByEmail(input.email);
    if (!foundUser) {
      foundUser = await createUser({
        input: {
          name: input.firstName,
          email: input.email,
          image: input.image,
        },
        ctx,
      });
    }

    // create profile: firstName, roleId,
    // set invitationCode, invitedBy if willInvite = true
    // set profile.status = 'pending' if willInvite = true
    // send invitation link
    const profile = await createProfile({
      input: {
        firstName: input.firstName,
        roleId: input.roleId,
        userId: foundUser.id,
        invitationCode: input.willInvite ? randomCuid() : undefined,
      },
      ctx,
    });

    ctx.tx = oldTx;
    return profile;
  });
};
