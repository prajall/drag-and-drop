export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^lucide-react$": "<rootDir>/src/__mocks__/lucide-react.js", // Correct mapping
  },

  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!lucide-react)", // Transform lucide-react module
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
