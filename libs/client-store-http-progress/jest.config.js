const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/client-store-http-progress',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
  displayName: 'client-store-http-progress',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 37,
      functions: 49,
      lines: 69,
      statements: 70,
    },
  },
};
