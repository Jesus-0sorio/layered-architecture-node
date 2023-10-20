export default {
  moduleFileExtensions: [
    'mjs',
    'js',
  ],
  testMatch: [
    '**/__tests__/**/*.js',
  ],
  collectCoverageFrom: [
    '**/app.mjs',
    '**/handlers/**/*.js',
  ],
  verbose: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
