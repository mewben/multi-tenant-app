import {
  getDomainUrl,
  randomCuid,
  type CreateUserProfileInput,
  type WithContext,
} from "@acme/shared";

import { createProfile } from "~/api/profile/helpers/create-profile";
import { createUser } from "~/api/user/helpers/create-user";
import { UserModel } from "~/api/user/model";
import { getCurrentProfileFromContext } from "~/api/utils/get-current-user-from-context";
import { sendEmail } from "~/api/utils/send-email";

interface Props extends WithContext {
  input: CreateUserProfileInput;
}
// this method creates a workspace user profile
// with/without invitation
export const create = async ({ input, ctx }: Props) => {
  const oldTx = ctx.tx;
  return await ctx.prisma.$transaction(async (tx) => {
    ctx.tx = oldTx ?? tx;

    const currentProfile = getCurrentProfileFromContext(ctx);

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

    if (input.willInvite) {
      // send invitation link
      // <domain>/accept-invitation?email=email&invitationCode=333344
      const invitationLink =
        getDomainUrl({ domain: currentProfile.workspace.domain }) +
        `/accept-invitation?email=${input.email}&invitationCode=${profile.invitationCode}`;

      if (process.env.NODE_ENV !== "production") {
        console.log("--- INVITATION LINK: ", invitationLink);
      }

      void sendEmail({
        to: input.email,
        subject: "TODO: You are invited.",
        text: `Accept invitation link: ${invitationLink}`,
      });
    }

    ctx.tx = oldTx;
    return profile;
  });
};
