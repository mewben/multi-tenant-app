const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./apps/nextjs",
});

const config = require("./packages/config/jest");

module.exports = createJestConfig(config);
