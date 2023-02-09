interface Props {
  domain?: string;
  customDomain?: string;
  includeProtocol?: boolean;
}

// we use process.env here instead of env
// because we use this function for both server & client
export const getDomainUrl = ({
  domain,
  customDomain,
  includeProtocol = true,
}: Props = {}) => {
  if (customDomain) return customDomain;

  const subdomain = domain ?? process.env.NEXT_PUBLIC_APP_SUBDOMAIN ?? "app";
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "";
  let http = includeProtocol ? "https://" : "";
  let port = "";

  if (!process.env.VERCEL) {
    http = includeProtocol ? "http://" : "";
    port = ":3000";
  }

  return `${http}${subdomain}.${appDomain}${port}`;
};
