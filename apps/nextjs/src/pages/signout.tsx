import { useEffect } from "react";
import { type NextPage } from "next";
import { getDomainUrl, t } from "@acme/shared";

const Signout: NextPage = () => {
  useEffect(() => {
    window.location.replace(
      getDomainUrl() +
        `/callback?action=signout&redirect_uri=` +
        window.location.origin +
        `/signin`,
    );
  }, []);

  return <>{t("tn.signing out")}</>;
};

export default Signout;
