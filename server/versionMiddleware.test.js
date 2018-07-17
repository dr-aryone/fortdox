const { correctVersion } = require('./versionMiddleware');

test('If no header it fails', () => {
  const req = {
    headers: {} //{ 'X-FORTDOX-VERSION': { version: '1.0' } }
  };

  expect(correctVersion(req)).toBe(false);
});

test('If header found but no version it fails', () => {
  const req = {
    headers: { 'X-FORTDOX-VERSION': { gurka: '1.0' } }
  };
  expect(correctVersion(req)).toBe(false);
});

test('If header and there exist a version is fine', () => {
  const req = {
    headers: { 'X-FORTDOX-VERSION': { version: '1.0' } }
  };
  expect(correctVersion(req)).toBe(true);
});
