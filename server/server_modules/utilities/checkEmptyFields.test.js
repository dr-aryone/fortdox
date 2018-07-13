const emptyFields = require('./checkEmptyFields');

test('Can not create document with empty title', () => {
  const doc = {
    title: '',
    encryptedTexts: [],
    texts: []
  };

  const result = emptyFields(doc);
  expect(result.valid).toBe(false);
});

test('Can not create document without any text fields', () => {
  const doc = {
    title: 'Dummy title',
    encryptedTexts: [],
    texts: []
  };

  const result = emptyFields(doc);
  expect(result.valid).toBe(false);
});

test('Can create a document with title and encrypted field', () => {
  const doc = {
    title: 'Dummy title',
    encryptedTexts: [{ text: 'Dummy' }],
    texts: []
  };

  const result = emptyFields(doc);
  expect(result.valid).toBe(true);
});

test('Can create a document with title and text field', () => {
  const doc = {
    title: 'Dummy title',
    encryptedTexts: [],
    texts: [{ text: 'Dummy' }]
  };

  const result = emptyFields(doc);
  expect(result.valid).toBe(true);
});

test('Can create a document with title, encrypted field and text field', () => {
  const doc = {
    title: 'Dummy title',
    encryptedTexts: [{ text: 'Dummy' }],
    texts: [{ text: 'Dummy' }]
  };

  const result = emptyFields(doc);
  expect(result.valid).toBe(true);
});
