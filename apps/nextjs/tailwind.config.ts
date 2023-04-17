import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
  corePlugins: {
    preflight: false, // for mantine styles to work properly
  },
} satisfies Config;
