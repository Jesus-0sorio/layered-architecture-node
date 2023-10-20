export default {
  moduleFileExtensions: [
    'js',
  ],
  testMatch: ['**/?(*.)+(spec|test).js'],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
