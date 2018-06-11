const { Map } = require('immutable');
const checkEmptyFields = require('./checkEmptyFields');

it('can check empty fields and return the set of empty fields', () => {
  const fields = Map({
    field1: Map({
      value: 'someRandomValue',
      error: null
    }),
    emptyField: Map({
      value: '',
      error: null
    }),
    emptyField2: Map({
      value: '',
      error: null
    })
  });

  let result = checkEmptyFields(fields);
  result = result.toJS();
  const expectedResult = [
    ['emptyField', Map({value: '', error: null})],
    ['emptyField2', Map({value: '', error: null})]
  ];

  expect(result).toEqual(expectedResult);
});
