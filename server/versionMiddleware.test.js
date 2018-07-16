const { correctVersion } = require('./versionMiddleware');

test('If no header it fails', () => {
  const req = {
    headers: {} //{ 'X-FORTDOX-VERSION': { version: '1.0' } }
  };

  expect(correctVersion(req)).toBe(false);
});

test('If header found its okay', () => {
  const req = {
    headers: { 'X-FORTDOX-VERSION': { version: '1.0' } }
  };
  expect(correctVersion(req)).toBe(true);
});
