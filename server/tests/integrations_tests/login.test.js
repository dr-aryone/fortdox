const request = require('request-promise');
const fs = require('fs-extra');

const steps = 2;
let sucess = 0;
function run() {
  return test()
    .then(credentials => {
      return new Promise((resolve, reject) => {
        console.log('Sucess!');
        console.log();
        console.log('### TEST SUMMARY ###');
        console.log(`${sucess} steps passed of ${steps} of login flow test.`);

        fs.writeFile(
          `${__dirname}/tmp/credentials-token.tmp.json`,
          JSON.stringify(credentials),
          error => {
            if (error) {
              console.error('Could not write file', error);
              reject();
            }
            console.log(
              `Credentials written to ${__dirname}/tmp/credentials-token.tmp.json`
            );
            console.log();
            resolve();
          }
        );
      });
    })
    .catch(error => {
      console.error('Test of login flow failed:');
      console.log();
      console.error('\t*  ', error.message);
      console.log();
      console.log('### TEST SUMMARY ###');
      console.log(`${sucess} steps passed of ${steps} of login flow test.`);
    });
}
async function test() {
  //read credentials files obtained from registraion.test.js
  let credentials = JSON.parse(
    fs.readFileSync(`${__dirname}/tmp/credentials.tmp.json`)
  );
  let token;
  try {
    token = await login(credentials);
    sucess++;
  } catch (error) {
    throw error;
  }

  try {
    await loginCheck(token.token);
    sucess++;
  } catch (error) {
    throw error;
  }

  credentials.token = token.token;

  return credentials;
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

async function loginCheck(token) {
  try {
    let response = await request('http://localhost:8000/login/check', {
      auth: {
        bearer: token
      }
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

module.exports = { run, login };
