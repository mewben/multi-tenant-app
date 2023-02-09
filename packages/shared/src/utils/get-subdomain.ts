export const getSubdomain = (host = "") => {
  return host.split(".")[0] || "";
};
