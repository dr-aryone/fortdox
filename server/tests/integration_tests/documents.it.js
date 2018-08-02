const config = require('app/config');
let request = require('request-promise').defaults({
  headers: { 'x-fortdox-version': config.clientVersion }
});

const fs = require('fs-extra');
const expect = require('@edgeguideab/expect');

const steps = 1;
let success = 0;
const testName = 'Document Flow Test';
function run() {
  console.log(`### ${testName} ###`);
  return test()
    .then(() => {
      return new Promise(resolve => {
        console.log('Sucess!');
        console.log();
        console.log(`TEST SUMMARY ${testName} ###`);
        console.log(`${success} steps passed of ${steps} of ${testName}`);

        console.log();
        resolve();
      });
    })
    .catch(error => {
      console.error(`Test of ${testName} failed: `);
      console.log();
      console.error('\t*  ', error.message);
      console.log();
      console.log('### TEST SUMMARY ###');
      console.log(`${success} steps passed of ${steps} of ${testName}`);
    });
}

async function test() {
  //read credentials files obtained from login.test.js
  let credentials = JSON.parse(
    fs.readFileSync(`${__dirname}/tmp/credentials-token.tmp.json`)
  );

  try {
    const newDocument = await createDocument(credentials);
    success++;
  } catch (error) {
    throw error;
  }
}

async function createDocument(credentials) {
  const document = {
    title: 'Dummy title',
    encryptedTexts: JSON.stringify([{ text: 'Dummy' }]),
    texts: JSON.stringify([{ text: 'Dummy' }]),
    tags: 'a,b,c,'
  };

  try {
    let response = await request('http://localhost:8000/document', {
      method: 'POST',
      auth: {
        bearer: credentials.token
      },
      body: document,
      json: true
    });
    const expectations = expect(
      {
        _id: 'string'
      },
      response
    );

    if (!expectations.wereMet()) {
      throw {
        message: `/document create did not return expected fields..
                  Extra info ${expectations.errors().toString()}`
      };
    }

    return response;
  } catch (error) {
    throw {
      message: `/document create 
                  :- Failed with statuscode ${error.statusCode}
                  :- error message: ${error.message}`,
      orginalError: error
    };
  }
}

module.exports = { run };
