import { useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";

const ACTIONS = {
  SIGNIN: "signin",
  SIGNIN_CB: "signin_cb", // after successful signin redirect from oauth
  SIGNOUT: "signout",
  SIGNOUT_CB: "signout_cb",
};

// This is a page that performs actions like
// signing in from different subdomain/workspace
// We do this because oauth doesn't accept wildcard
// callbacks e.g. *.example.com
// The url for this must be at the main subdomain
// TODO: whitelist referrer
const Callback: NextPage = () => {
  const router = useRouter();

  const handleAction = (action: string) => {
    const origin = window.location.origin;
    const provider = router.query.provider as string;
    const redirectUri = router.query.redirect_uri as string;

    switch (action) {
      case ACTIONS.SIGNIN:
        return void signIn(provider, {
          callbackUrl: `${origin}/callback?action=${ACTIONS.SIGNIN_CB}&redirect_uri=${redirectUri}`,
        });

      case ACTIONS.SIGNIN_CB:
      case ACTIONS.SIGNOUT_CB:
        return window.location.replace(redirectUri);

      case ACTIONS.SIGNOUT:
        return void signOut({
          callbackUrl: `${window.location.origin}/callback?action=${ACTIONS.SIGNOUT_CB}&redirect_uri=${redirectUri}`,
        });

      default:
        return null;
    }
  };

  useEffect(() => {
    const action = router.query.action as string;

    // TODO: handle validations here
    handleAction(action);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return null;
};

export default Callback;
