import { useRouter } from "next/router";
import { includes, isEmpty } from "lodash";
import { useSession } from "next-auth/react";
import { getDomainUrl } from "@acme/shared";

import { AdminLayout } from "../layouts/admin-layout";
import { DefaultLayout } from "../layouts/default-layout";

interface Props {
  to?: string;
  excludePaths?: Array<string>;
  children: React.ReactNode;
}

const excludePrivatePaths = ["/welcome", "/create-workspace"];

export const PrivateWrapper = ({
  children,
  to = "/signin",
  excludePaths = [],
}: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // if in excludePaths return normally
  if (includes(excludePaths, router.pathname)) {
    return <DefaultLayout>{children}</DefaultLayout>;
  }

  if (status === "unauthenticated") {
    // if not logged in, redirect to /signin
    void router.replace(to);
  } else if (status === "authenticated" && !isEmpty(session?.user)) {
    if (includes(excludePrivatePaths, router.pathname)) {
      return <DefaultLayout>{children}</DefaultLayout>;
    }

    if (!session?.user.emailVerified) {
      // if not verified, redirect to /verify-user
      void router.replace(`/verify-user?userId=${session.user.id}`);
    } else if (isEmpty(session.user.profile)) {
      void router.replace(getDomainUrl() + "/welcome");
    } else if (!isEmpty(session.user.profile)) {
      return <AdminLayout user={session.user}>{children}</AdminLayout>;
    }
  }

  return <DefaultLayout>loading</DefaultLayout>;
};
