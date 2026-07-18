/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node'],
  },
  roots: ['<rootDir>/__tests__'],
  testMatch: [
    '<rootDir>/__tests__/**/*.test.(ts|tsx)',
    '<rootDir>/**/*.test.(ts|tsx)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          isolateModules: true,
          target: 'es2022',
          module: 'commonjs',
          moduleResolution: 'node',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/prisma/(.*)$': '<rootDir>/prisma/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/config/(.*)$': '<rootDir>/config/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'app/**/*.{js,ts,tsx}',
    'components/**/*.{js,ts,tsx}',
    'lib/**/*.{js,ts,tsx}',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/next.config.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
}