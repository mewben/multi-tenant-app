const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./apps/nextjs",
});

const config = require("./packages/config/jest/api.config.js");

module.exports = createJestConfig(config);
