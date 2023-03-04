import type { AppType } from "next/app";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";
import { api } from "~/utils/api";
import { PopupProvider } from "~/components/popup";
import { CheckWorkspaceWrapper } from "~/components/wrappers/check-workspace-wrapper";
import { I18nProvider } from "~/components/wrappers/i18n-provider";
import { PrivateWrapper } from "~/components/wrappers/private-wrapper";
import { env } from "~/env.mjs";
import "~/utils/i18n-init";

const publicPaths = [
  "/signin",
  "/signout",
  "/signup",
  "/callback",
  "/verify-user",
  "/forgot-password",
  "/reset-password",
  "/accept-invitation",
];

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withCSSVariables
        withGlobalStyles
        withNormalizeCSS
        theme={{ primaryColor: "violet" }}
      >
        <CheckWorkspaceWrapper>
          <I18nProvider>
            <PopupProvider>
              <NotificationsProvider
                limit={3}
                autoClose={+env.NEXT_PUBLIC_NOTIF_AUTO_CLOSE}
                className="notifications-provider"
              >
                <PrivateWrapper to="/signin" excludePaths={publicPaths}>
                  <Component {...pageProps} />
                </PrivateWrapper>
              </NotificationsProvider>
            </PopupProvider>
          </I18nProvider>
        </CheckWorkspaceWrapper>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
