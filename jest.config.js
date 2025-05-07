module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@core(|/.*)$': '<rootDir>/src/contexts/core/$1',
    '^@context-ecosystem(|/.*)$': '<rootDir>/src/contexts/ecosystem/$1',
    '^@module-project(|/.*)$': '<rootDir>/src/contexts/project/$1',
    '^@module-module(|/.*)$': '<rootDir>/src/contexts/module/$1',
    '^@module-sub-module(|/.*)$': '<rootDir>/src/contexts/sub-module/$1',
    '^@module-action(|/.*)$': '<rootDir>/src/contexts/action/$1',
    '^@module-resource(|/.*)$': '<rootDir>/src/contexts/resource/$1',
  },
  // Tests ahora están organizados dentro de cada contexto
  roots: [
    "<rootDir>/src"
  ],
};
