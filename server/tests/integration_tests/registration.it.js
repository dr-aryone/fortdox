const config = require('app/config');
let request = require('request-promise').defaults({
  headers: { 'x-fortdox-version': config.clientVersion }
});

const prompt = require('syncprompt');
const fs = require('fs-extra');

const steps = 3;
let success = 0;

function run() {
  console.log('### Registration Flow Test ###');
  return test()
    .then(credentials => {
      return new Promise((resolve, reject) => {
        console.log('Sucess!');
        console.log();
        console.log('TEST SUMMARY Registration Flow Test ###');
        console.log(
          `${success} steps passed of ${steps} of registration flow test.`
        );

        fs.writeFile(
          `${__dirname}/tmp/credentials.tmp.json`,
          JSON.stringify(credentials),
          error => {
            if (error) {
              console.error('Could not write file', error);
              reject();
            }
            console.log(
              `Credentials written to ${__dirname}/tmp/credentials.tmp.json`
            );
            console.log();
            resolve();
          }
        );
      });
    })
    .catch(error => {
      console.error('Test of registration flow failed:');
      console.log();
      console.error('\t*  ', error.message);
      console.log();
      console.log('### TEST SUMMARY ###');
      console.log(
        `${success} steps passed of ${steps} of Registration flow test.`
      );
    });
}
async function test() {
  const testOrg = {
    email: 'test@example.org',
    organization: 'Test'
  };

  try {
    await registerOrganization(testOrg);
    success++;
  } catch (error) {
    throw error;
  }

  const activationCode = prompt('Enter activaiton code\n');
  console.log(activationCode);

  let credentials;
  try {
    credentials = await verifyOrganization({ activationCode });
    success++;
  } catch (error) {
    throw error;
  }

  credentials.deviceName = 'Test Script Device';

  try {
    await confirmOrganization(credentials);
    success++;
  } catch (error) {
    throw error;
  }
  return credentials;
}

async function registerOrganization(testOrg) {
  try {
    let response = await request('http://localhost:8000/register', {
      method: 'POST',
      body: testOrg,
      json: true
    });
    return response;
  } catch (error) {
    throw {
      message: `/register 
        :- Failed with statuscode: ${error.statusCode} 
        :- error message: ${error.message}`,
      originalError: error
    };
  }
}

async function verifyOrganization(activaitonCode) {
  try {
    let response = await request('http://localhost:8000/register/verify', {
      method: 'POST',
      body: activaitonCode,
      json: true
    });

    return response;
  } catch (error) {
    throw {
      message: `/register/verify
        :- Failed with statuscode: ${error.statusCode}
        :- error message: ${error.message}`,
      originalError: error
    };
  }
}

async function confirmOrganization(credentials) {
  try {
    let response = await request('http://localhost:8000/register/confirm', {
      method: 'POST',
      body: credentials,
      json: true
    });
    return response;
  } catch (error) {
    throw {
      message: `/register/confirm
        :- Failed with statuscode: ${error.statusCode}
        :- error message:${error.message}`,
      originalError: error
    };
  }
}

module.exports = { run };
