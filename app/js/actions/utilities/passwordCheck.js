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
        errorMsg = 'Password needs to at least be 8 characters long.';
        break;
      case 'CONTAINS_COMMON_PATTERNS':
      case 'TOO_COMMON':
        errorMsg = 'Your password is not strong enough.';
        break;
      case 'TOO_FEW_NUMERIC_CHARACTERS':
        errorMsg = 'Password needs to at least have one number.';
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
