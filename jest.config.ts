
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@app/(.*)$": ["<rootDir>/src/$1"]
  },
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};

export default config;