module.exports = {
  preset: "<rootDir>/packages/config/jest",
  // verbose: true, // show/hide check marks
  testTimeout: 20000,
  testEnvironment: "node",
  // This runs once before all tests
  globalSetup: "<rootDir>/packages/config/jest/global.api.setup.js",
  globalTeardown: "<rootDir>/packages/config/jest/global.api.teardown.js",
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    "^~/api/fixtures": "<rootDir>/packages/api/test-fixtures",
    "^~/api/(.*)$": "<rootDir>/packages/api/src/$1",
  },
};
