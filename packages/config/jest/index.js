module.exports = {
  verbose: true,
  testTimeout: 20000,
  testEnvironment: "node",
  // This runs once before all tests
  globalSetup: "<rootDir>/packages/config/jest/global.setup.js",
  globalTeardown: "<rootDir>/packages/config/jest/global.teardown.js",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
