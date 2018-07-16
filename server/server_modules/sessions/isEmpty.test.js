const { isObjEmpty } = require('./isEmpty');

test('Totaly empty object is true', () => {
  const obj = {};
  const result = isObjEmpty(obj);
  expect(result).toBe(true);
});

test('Object with empty string is counted as empty', () => {
  const obj = { a: '' };
  const result = isObjEmpty(obj);
  expect(result).toBe(true);
});

test('Object with values is not empty', () => {
  const obj = { a: 'a', b: 'b', c: 5 };
  const result = isObjEmpty(obj);
  expect(result).toBe(false);
});

test('Object with neasted empty value is empty', () => {
  const obj = {
    a: 'a',
    b: 'b',
    c: {
      a: 'a',
      c: null,
      b: ''
    }
  };
  const result = isObjEmpty(obj);
  expect(result).toBe(true);
});

test('Sanity check for usage, should be empty', () => {
  const obj = {
    privateKey: [],
    deviceId: '456',
    email: 'example@example.org',
    organizationId: 5,
    organization: 'Org',
    organizationIndex: 'uuid-uuid-12314-234234324'
  };
  const result = isObjEmpty(obj);
  expect(result).toBe(false);
});

test('Sanity check for usage, should not be empty', () => {
  const obj = {
    privateKey: new ArrayBuffer(8),
    deviceId: '456',
    email: 'example@example.org',
    organizationId: 5,
    organization: 'Org',
    organizationIndex: 'uuid-uuid-12314-234234324'
  };
  const result = isObjEmpty(obj);
  expect(result).toBe(false);
});
