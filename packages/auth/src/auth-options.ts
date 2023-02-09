import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { PROVIDER_TYPES, prisma } from "@acme/db";

import { getCurrentUser } from "./get-current-user";

const useSecureCookies = !!process.env.VERCEL_URL;

// /**
//  * Module augmentation for `next-auth` types
//  * Allows us to add custom properties to the `session` object
//  * and keep type safety
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  **/
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       // ...other properties
//       // role: UserRole;
//     } & DefaultSession["user"];
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

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
          return await Promise.resolve(null);
          // if (credentials?.action === "signup") {
          //   return await signup({ input: credentials });
          // }

          // return await signin({
          //   input: credentials as SigninInput,
          //   headers: req.headers ?? {},
          // });
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

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions2: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        // session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
};
