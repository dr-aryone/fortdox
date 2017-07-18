const checkEmptyFields = fields => {
  let emptyFields = [];
  fields.entrySeq().forEach((entry) => {
    if (entry[1].get('value').trim() === '') emptyFields.push(entry);
  });
  return emptyFields;
};

module.exports = checkEmptyFields;
