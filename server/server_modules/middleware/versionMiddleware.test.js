const { correctVersion } = require('./versionMiddleware');
const config = require('app/config');

test('If no header it fails', () => {
  const version = '';
  expect(correctVersion(version)).toBe(false);
});

test('Present header but version is lower than required should fail', () => {
  const version = '0.5';
  expect(correctVersion(version)).toBe(false);
});
test('Present header but version is higher than required should fail', () => {
  const version = '1.2';
  expect(correctVersion(version)).toBe(false);
});

test('Present header and version is matching it should pass', () => {
  const version = config.clientVersion;
  expect(correctVersion(version)).toBe(true);
});
