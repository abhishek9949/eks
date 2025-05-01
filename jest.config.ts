import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // This is optional but you can add additional setup after the environment is set up.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // This file can set up testing-library extensions or global mocks
  collectCoverage: true, // Enable collecting coverage information
  coverageDirectory: 'coverage', // Define where to output the coverage report
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config, which is async
export default createJestConfig(config)
