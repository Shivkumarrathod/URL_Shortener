exports = {
  testEnvironment: 'node',
  testTimeout: 30000,           // generous timeout for DB queries in CI
  runInBand: true,              // serial execution — avoids DB race conditions
  forceExit: true,              // don't hang on open DB/Redis connections
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.',
      outputName:      'junit.xml',  // Jenkins reads this for test reporting UI
    }],
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/db/schema.sql',
  ],
};