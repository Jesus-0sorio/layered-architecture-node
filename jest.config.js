export default {
  moduleFileExtensions: [
    'js',
    'mjs',
  ],
  testMatch: ['**/?(*.)+(test).(m)js', '**/?(*.)+(test).js'],
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/services/**/*.js',
    '!src/**/__tests__/**',
  ],
  coverageReporters: ['text', 'cobertura'], // Añade cobertura como formato de reporte
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

