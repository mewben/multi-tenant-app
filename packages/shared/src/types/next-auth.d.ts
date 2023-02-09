import type { IncomingHttpHeaders } from "http";
import type { ISODateString } from "next-auth";

import type { CurrentUser, WithPrisma } from "./app";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session2 extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface Session {
    user?: CurrentUser;
    expires: ISODateString;
  }

  interface Context extends WithPrisma {
    session: Session | null;
    headers: IncomingHttpHeaders;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}
