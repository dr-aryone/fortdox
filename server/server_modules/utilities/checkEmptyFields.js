const checkEmptyFields = doc => {
  let emptyFields = {};
  let valid = true;
  if (doc.title.trim() === '') {
    valid = false;
    emptyFields.title = 'Title field can not be empty.';
  }
  let encryptedTexts = [];
  doc.encryptedTexts.forEach(field => {
    if (field.text.trim() === '') {
      valid = false;
      encryptedTexts.push(field.id);
    }
  });
  emptyFields.encryptedTexts = encryptedTexts;
  let texts = [];
  doc.texts.forEach(field => {
    if (field.text.trim() === '') {
      valid = false;
      texts.push(field.id);
    }
  });
  emptyFields.texts = texts;
  let reason;
  if (!valid) reason = 'Fields can not be empty.';
  return {valid, emptyFields, reason};
};

module.exports = checkEmptyFields;
