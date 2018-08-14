let correctVersion;

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

function setup(mockedVersion) {
  jest.doMock('app/config', () => ({
    clientVersion: mockedVersion
  }));
  correctVersion = require('./versionMiddleware').correctVersion;
}

test('If no header it fails', () => {
  setup('1.0.0');
  const version = '';
  expect(correctVersion(version)).toBe(false);
});

test('If a badly formatted is provided header it fails (1.a.3)', () => {
  setup('1.0.0');
  const version = '1.a.3';
  expect(correctVersion(version)).toBe(false);
});

test('If a badly formatted is provided header it fails (a.b.1)', () => {
  setup('1.0.0');
  const version = 'a.b.1';
  expect(correctVersion(version)).toBe(false);
});

test('If a badly formatted is provided header it fails (foobar)', () => {
  setup('1.0.0');
  const version = 'foobar';
  expect(correctVersion(version)).toBe(false);
});

test('Present header but major version is lower than required should fail', () => {
  setup('1.0.0');
  const version = '0.5';
  expect(correctVersion(version)).toBe(false);
});

test('Present header but minor version is lower than required should fail', () => {
  setup('1.2.1');
  const version = '1.2';
  expect(correctVersion(version)).toBe(false);
});

test('Present header but minor version is higher than required should pass', () => {
  setup('1.0.0');
  const version = '1.2';
  expect(correctVersion(version)).toBe(true);
});

test('Present header but minor version is higher than required should pass', () => {
  setup('1.1.1');
  const version = '1.2';
  expect(correctVersion(version)).toBe(true);
});

test('Present header but major version is higher than required should pass', () => {
  setup('1.1.1');
  const version = '2.1';
  expect(correctVersion(version)).toBe(true);
});

test('Present header and version is matching it should pass', () => {
  setup('1.0.0');
  const version = '1.0.0';

  expect(correctVersion(version)).toBe(true);
});
