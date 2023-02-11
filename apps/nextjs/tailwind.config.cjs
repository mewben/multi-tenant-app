/** @type {import("tailwindcss").Config} */
module.exports = {
  // @ts-ignore
  presets: [require("@acme/tailwind-config")],
  corePlugins: {
    preflight: false, // for mantine styles to work properly
  },
};
