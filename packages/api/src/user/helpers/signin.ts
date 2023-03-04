import { find, isEmpty } from "lodash";
import { AUTH_PROVIDERS, prisma } from "@acme/db";
import {
  cleanAndValidate,
  getSubdomain,
  signinSchema,
  throwError,
  type SigninInput,
} from "@acme/shared";

import { hashPassword } from "~/api/account/helpers/hash-password";

interface Props {
  input: SigninInput;
  headers: Record<string, string>;
}
// this is for credentials signin
export const signin = async ({ input, headers }: Props) => {
  // clean and validate input
  const { data } = cleanAndValidate({ schema: signinSchema, input });

  // check if user and account exists
  const user = await prisma.user.findUnique({
    where: {
      email: data?.email as string,
    },
    select: {
      id: true,
      email: true,
      accounts: {
        select: {
          provider: true,
          hashedPassword: true,
          salt: true,
        },
      },
      profiles: {
        select: {
          status: true,
          workspace: {
            select: {
              domain: true,
            },
          },
        },
      },
    },
  });
  if (isEmpty(user)) return throwError(`tn.error:auth.invalidCredentials`);

  const credentialsAccount = find(user.accounts, {
    provider: AUTH_PROVIDERS.credentials,
  });
  if (isEmpty(credentialsAccount))
    return throwError(`tn.error:auth.noCredentialsAccount`);

  // check password
  const [hashedPassword] = hashPassword(
    data?.password as string,
    credentialsAccount.salt ?? "",
  );
  if (hashedPassword !== credentialsAccount.hashedPassword) {
    return throwError(`tn.error:auth.invalidCredentials`);
  }

  // checks if the user is present in the current workspace
  const currentDomain = getSubdomain(headers.host);
  if (currentDomain !== process.env.NEXT_PUBLIC_APP_SUBDOMAIN) {
    const currentProfile = find(user.profiles, (profile) => {
      if (profile.workspace.domain === currentDomain) {
        return profile;
      }
    });
    if (!currentProfile) return throwError(`tn.error:workspace.notFound`);
  }

  return { id: user.id };
};
