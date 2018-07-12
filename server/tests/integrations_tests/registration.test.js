const request = require('request-promise');
const prompt = require('syncprompt');
const fs = require('fs-extra');

const steps = 3;
let sucesss = 0;

test()
  .then(credentials => {
    console.log('Sucess!');
    console.log();
    console.log('### TEST SUMMARY ###');
    console.log(
      `${sucesss} steps passed of ${steps} of registration flow test.`
    );

    fs.writeFile('./tmp/credentials.json', JSON.stringify(credentials), error => {
      if (error) {
        console.error('Could not write file', error);
        return;
      }
      console.log('Credentials written to /tmp/credentials.json');
    });
  })
  .catch(error => {
    console.error('Test of registration flow failed:');
    console.log();
    console.error('\t*  ', error.message);
    console.log();
    console.log('### TEST SUMMARY ###');
    console.log(
      `${sucesss} steps passed of ${steps} of Registration flow test.`
    );
  });

async function test() {
  const testOrg = {
    email: 'david.skeppstedt+testtest@gmail.com',
    organization: 'Test2'
  };

  try {
    await registerOrganization(testOrg);
    sucesss++;
  } catch (error) {
    throw error;
  }

  const activationCode = prompt('Enter activaiton code\n');
  console.log(activationCode);

  let credentials;
  try {
    credentials = await verifyOrganization({ activationCode });
    sucesss++;
  } catch (error) {
    throw error;
  }

  credentials.deviceName = 'Test Script Device';

  try {
    await confirmOrganization(credentials);
    sucesss++;
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
