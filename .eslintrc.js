/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["acme"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  reportUnusedDisableDirectives: true,
  ignorePatterns: [
    ".eslintrc.js",
    "**/*.config.js",
    "**/*.config.cjs",
    "packages/config/**",
  ],
  settings: {
    next: {
      rootDir: ["apps/nextjs"],
    },
  }
};

module.exports = config;
