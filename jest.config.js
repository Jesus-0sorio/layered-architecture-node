export default {
  moduleFileExtensions: [
    'js',
    'mjs',
  ],
  testMatch: ['**/?(*.)+(test).(m)js', '**/?(*.)+(test).js'],
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
