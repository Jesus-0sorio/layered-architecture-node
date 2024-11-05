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
    'src/**/*.js',
    '!src/**/__tests__/**', // Excluye archivos de prueba
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

