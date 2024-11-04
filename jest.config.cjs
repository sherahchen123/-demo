/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['vue', 'js', 'ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        diagnostics: false,
        isolatedModules: true
      }
    ]
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]s$',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  }
} 