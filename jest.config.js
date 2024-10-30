export default {
  moduleFileExtensions: [
    'js',
    'mjs',
  ],
  testMatch: ['**/?(*.)+(test).(m)js', '**/?(*.)+(test).js'],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
