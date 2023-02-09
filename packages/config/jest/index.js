module.exports = {
  // verbose: true, // show/hide check marks
  testTimeout: 20000,
  testEnvironment: "node",
  // This runs once before all tests
  globalSetup: "<rootDir>/packages/config/jest/global.setup.js",
  globalTeardown: "<rootDir>/packages/config/jest/global.teardown.js",
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    "^~/api/fixtures": "<rootDir>/packages/api/test-fixtures",
    "^~/api/(.*)$": "<rootDir>/packages/api/src/$1",
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
