const request = require('request-promise');
const fs = require('fs-extra');

const steps = 1;
let sucess = 0;

test()
  .then(() => {
    console.log('Sucess!');
    console.log();
    console.log('### TEST SUMMARY ###');
    console.log(`${sucess} steps passed of ${steps} of login flow test.`);
  })
  .catch(error => {
    console.error('Test of login flow failed:');
    console.log();
    console.error('\t*  ', error.message);
    console.log();
    console.log('### TEST SUMMARY ###');
    console.log(
      `${sucess} steps passed of ${steps} of Registration flow test.`
    );
  });

async function test() {
  //read credentials files obtained from registraion.test.js
  const credentials = JSON.parse(fs.readFileSync('./tmp/credentials.tmp.json'));
  let token;
  try {
    token = await login(credentials);
    sucess++;
  } catch (error) {
    throw error;
  }
  console.log('Token', token);
}

async function login(credentials) {
  try {
    let response = await request('http://localhost:8000/login', {
      method: 'POST',
      body: credentials,
      json: true
    });
    return response;
  } catch (error) {
    throw {
      message: `/login
            :- Failed with statuscode ${error.statusCode}
            :- error message: ${error.message}`,
      orginalError: error
    };
  }
}

async function loginCheck(body, token) {
  //TODO:fix auyth
  try {
    let response = await request('http://localhost/login/check', {
      method: 'POST',
      body: body,
      json: true
    });
    return response;
  } catch (error) {
    throw {
      message: `/login/check
            :- Failed with statuscode ${error.statusCode}
            :- error message: ${error.message}`,
      orginalError: error
    };
  }
}
