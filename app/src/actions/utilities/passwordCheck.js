const pwCheck = require('@edgeguideab/password-check');

const passwordCheck = (password, retypedPassword) => {
  if (password !== retypedPassword) {
    return {
      valid: false,
      fault: 'retypedPassword',
      errorMsg: 'Passwords didn\'t match.'
    };
  }
  let pwResult = pwCheck.evaluate(password, {
    length: 8,
    allowCommon: false,
    strict: true,
    numeric: 1
  });
  if (!pwResult.valid) {
    let errorMsg;
    switch (pwResult.reason) {
      case 'TOO_SHORT':
        errorMsg = 'Your password must be to at least 8 characters long.';
        break;
      case 'CONTAINS_COMMON_PATTERNS':
      case 'TOO_COMMON':
        errorMsg = 'Your password is too common. Please enter a stronger password.';
        break;
      case 'TOO_FEW_NUMERIC_CHARACTERS':
        errorMsg = 'Your password must include 1 numeric character.';
        break;
      default:
        errorMsg = 'GENERIC PASSWORD ERROR';
        break;
    }
    return {
      valid: false,
      fault: 'password',
      errorMsg
    };
  }
  return {
    valid: true,
    fault: null,
    errorMsg: null
  };
};

module.exports = passwordCheck;
