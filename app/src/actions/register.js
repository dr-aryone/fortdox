import * as requestor from '@edgeguideab/client-request';
import { encryptPrivateKey } from 'actions/utilities/encryptPrivateKey';
const passwordCheck = require('actions/utilities/passwordCheck');
const { addKey, writeStorage } = require('actions/utilities/storage');
const config = require('config.json');
const checkEmptyFields = require('actions/utilities/checkEmptyFields');

export const activateOrganizaton = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'ACTIVATE_ORGANIZATION_START'
    });

    let state = getState();
    let fields = state.register.get('activateFields');
    let emptyFields = checkEmptyFields(fields);
    if (emptyFields.length > 0) {
      let newFields = {};
      emptyFields.forEach(entry => {
        let error;
        switch (entry[0]) {
          case 'password':
            error = 'Please enter a password.';
            break;
          case 'retypedPassword':
            error = 'Please re-enter your password.';
            break;
          default:
            console.error('Unexpected error');
            error = 'Something went terrible wrong';
            break;
        }
        newFields[entry[0]] = {
          error: {
            error
          }
        };
      });
      return dispatch({
        type: 'ACTIVATE_ORGANIZATION_FAIL',
        payload: newFields
      });
    }

    let privateKey = state.register.get('privateKey');
    let password = fields.getIn(['password', 'value']);
    let retypedPassword = fields.getIn(['retypedPassword', 'value']);
    let email = state.register.getIn(['registerFields', 'email', 'value']);
    let pwResult = passwordCheck(password, retypedPassword);
    if (!pwResult.valid) {
      console.error(pwResult.errorMsg);
      if (pwResult.fault === 'password')
        return dispatch({
          type: 'ACTIVATE_ORGANIZATION_PASSWORD_FAIL',
          payload: pwResult.errorMsg
        });
      if (pwResult.fault === 'retypedPassword')
        return dispatch({
          type: 'ACTIVATE_ORGANIZATION_PASSWORD_MISSMATCH_FAIL',
          payload: pwResult.errorMsg
        });
    }

    let result;
    try {
      result = await encryptPrivateKey(privateKey, password);
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'ACTIVATE_ORGANIZATION_ERROR',
        payload: 'Verification of the link failed.'
      });
    }
    let response;
    try {
      response = await requestor.post(`${config.server}/register/confirm`, {
        body: {
          email,
          privateKey
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 404:
          return dispatch({
            type: 'ACTIVATE_ORGANIZATION_ERROR',
            payload: 'Bad request. Please try again.'
          });
        case 409:
          return dispatch({
            type: 'ACTIVATE_ORGANIZATION_ERROR',
            payload: 'Organization already exists'
          });
        case 408:
        case 500:
        default:
          return dispatch({
            type: 'ACTIVATE_ORGANIZATION_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    try {
      await addKey(result.privateKey, email, response.body.organizationName);
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'ACTIVATE_ORGANIZATION_ERROR',
        payload: 'Unable to add key.'
      });
    }

    await writeStorage(result.salt, email, response.body.organizationName);

    return dispatch({
      type: 'ACTIVATE_ORGANIZATION_SUCCESS',
      payload: 'Team registration complete! You can now login.'
    });
  };
};

export const registerOrganization = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'REGISTER_ORGANIZATION_START'
    });

    let state = getState();
    let fields = state.register.get('registerFields');
    let emptyFields = checkEmptyFields(fields);
    if (emptyFields.count() > 0) {
      let newFields = {};
      emptyFields.forEach(key => {
        let error;
        switch (key[0]) {
          case 'organization':
            error = {
              error: 'Please enter a team name.'
            };
            break;
          case 'email':
            error = {
              error: 'Please enter an email.'
            };
            break;
          default:
            console.error('Unexpected error');
            error = { error: 'Something went terrible wrong' };
        }
        newFields[key[0]] = error;
      });

      return dispatch({
        type: 'REGISTER_ORGANIZATION_FAIL',
        payload: newFields
      });
    }

    let organization = fields.getIn(['organization', 'value']);
    let email = fields.getIn(['email', 'value']);
    try {
      await requestor.post(`${config.server}/register`, {
        body: {
          organization,
          email
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
          return dispatch({
            type: 'REGISTER_ORGANIZATION_ERROR',
            payload: 'Bad request. Please try again.'
          });
        case 409:
          if (error.body === 'organization')
            return dispatch({
              type: 'REGISTER_ORGANIZATION_NAME_FAIL',
              payload:
                'Team name already exists. Please choose a different team name.'
            });
          if (error.body === 'user')
            return dispatch({
              type: 'REGISTER_ORGANIZATION_EMAIL_FAIL',
              payload: 'Email already exists. Please choose a different email.'
            });
          break;
        case 408:
        case 503:
        case 500:
        default:
          return dispatch({
            type: 'REGISTER_ORGANIZATION_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    return dispatch({
      type: 'REGISTER_ORGANIZATION_SUCCESS',
      payload: {
        text: 'A message was sent to ',
        bold: email,
        text2: '. Please check your email to verify your registration.'
      }
    });
  };
};

export const verifyActivationCode = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'VERIFY_ACTIVATION_CODE_START'
    });

    let state = getState();
    let activationCode = state.register.getIn(['activationCode', 'value']);
    if (activationCode === '') {
      return dispatch({
        type: 'VERIFY_ACTIVATION_CODE_FAIL',
        payload: 'Please enter the activation code.'
      });
    }

    let response;
    try {
      response = await requestor.post(`${config.server}/register/verify`, {
        body: {
          activationCode
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 404:
          return dispatch({
            type: 'VERIFY_ACTIVATION_CODE_ERROR',
            payload:
              'Email has already been verified or wrong code was entered. Please try again.'
          });
        case 408:
        case 500:
        default:
          console.error(`The http status code was ${error.status}`);
          return dispatch({
            type: 'VERIFY_ACTIVATION_CODE_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    dispatch({
      type: 'VERIFY_ACTIVATION_CODE_SUCCESS',
      payload: {
        email: response.body.email,
        privateKey: response.body.privateKey.toString('base64')
      }
    });
  };
};
