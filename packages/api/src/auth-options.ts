import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type ISODateString, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { PROVIDER_TYPES, prisma } from "@acme/db";
import { type CurrentUser, type SigninInput } from "@acme/shared";

import { getCurrentUser } from "./user/helpers/get-current-user";
import { signin } from "./user/helpers/signin";
import { signup } from "./user/helpers/signup";

const useSecureCookies = !!process.env.VERCEL_URL;

declare module "next-auth" {
  interface Session {
    user?: CurrentUser;
    expires: ISODateString;
  }
}

export const getAuthOptions = (
  req: GetServerSidePropsContext["req"] | NextApiRequest,
  res: GetServerSidePropsContext["res"] | NextApiResponse,
): NextAuthOptions => {
  return {
    events: {
      async signIn({ user, account, isNewUser }) {
        if (isNewUser && account?.type === PROVIDER_TYPES.oauth) {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date(), updatedAt: new Date() },
          });
        }
      },
    },
    callbacks: {
      async session({ session, user, token }) {
        session.user = await getCurrentUser({
          userId: token?.sub || user?.id,
          ctx: { session, prisma, headers: req.headers },
        });

        return session;
      },
    },
    pages: {
      signIn: `/signin`,
      signOut: `/signout`,
    },
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: "jwt",
    },
    providers: [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID as string,
        clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      }),
      CredentialsProvider({
        async authorize(credentials, req) {
          if (credentials?.action === "signup") {
            return await signup({ input: credentials });
          }

          return await signin({
            input: credentials as SigninInput,
            headers: req.headers ?? {},
          });
        },
        credentials: {
          action: { type: "text" },
          name: { type: "text" },
          email: { type: "text" },
          password: { type: "text" },
        },
      }),
    ],
    cookies: {
      sessionToken: {
        name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: useSecureCookies,
          domain: `.${process.env.NEXT_PUBLIC_APP_DOMAIN as string}`, // for subdomain auth
        },
      },
    },
  };
};
