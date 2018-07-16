function isObjEmpty(obj, root = true) {
  let result = false;

  if (root && Object.entries(obj).length === 0) {
    return true;
  }

  for (let i in obj) {
    if (isEmpty(obj[i])) {
      return true;
    }
    if (obj[i] !== null && typeof obj[i] === 'object') {
      result = isObjEmpty(obj[i], false);
    }
  }
  return result;
}

function isEmpty(value) {
  if (value === null || value === undefined || value === '') {
    return true;
  }
  return false;
}
module.exports = { isObjEmpty };
