/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./src/**/*.tsx"],
  // @ts-ignore
  presets: [require("@acme/tailwind-config")],
  corePlugins: {
    preflight: false, // for mantine styles to work properly
  },
};

module.exports = config;
