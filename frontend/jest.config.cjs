module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(svg|png|jpg|gif)$': '<rootDir>/src/__mocks__/fileMock.cjs',
    '\\.(css)$': '<rootDir>/src/__mocks__/styleMock.cjs',
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@apollo/client|graphql|@graphql-typed-document-node|@repeaterjs|@whatwg-node)/)',
  ],
}
