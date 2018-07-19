const config = require('app/config');
let request = require('request-promise');

request = request.defaults({
  headers: { 'x-fortdox-version': config.clientVersion }
});

const fs = require('fs-extra');
const expect = require('@edgeguideab/expect');
const { login } = require('./login.it.js');

const steps = 6;
let success = 0;

function run() {
  console.log('### Device Flow Test ###');
  return test()
    .then(() => {
      return new Promise(resolve => {
        console.log('Sucess!');
        console.log();
        console.log('TEST SUMMARY Device Flow Test ###');
        console.log(`${success} steps passed of ${steps} of device flow test.`);

        console.log();
        resolve();
      });
    })
    .catch(error => {
      console.error('Test of device flow failed:');
      console.log();
      console.error('\t*  ', error.message);
      console.log();
      console.log('### TEST SUMMARY ###');
      console.log(`${success} steps passed of ${steps} of deivce flow test.`);
    });
}
async function test() {
  //read credentials files obtained from login.test.js
  let credentials = JSON.parse(
    fs.readFileSync(`${__dirname}/tmp/credentials-token.tmp.json`)
  );

  let devices;
  try {
    devices = await listDevices(credentials.token);
    success++;
  } catch (error) {
    throw error;
  }

  let invitecode;
  try {
    invitecode = await addDevice(credentials);
    success++;
  } catch (error) {
    throw error;
  }

  let newPrivatekey;
  try {
    newPrivatekey = await verifyDevice(invitecode, credentials);
    success++;
  } catch (error) {
    throw error;
  }
  newPrivatekey.email = credentials.email;
  newPrivatekey.deviceName = 'Test Device Numbero dos';

  try {
    await confirmDevice(newPrivatekey);
    success++;
  } catch (error) {
    throw error;
  }
  //we need to login with newDevice here to use it...
  const newDeviceLogin = await login(newPrivatekey);
  newPrivatekey.token = newDeviceLogin.token;
  //update name
  try {
    await updateName(newPrivatekey);
    success++;
  } catch (error) {
    throw error;
  }

  //delete
  try {
    await deleteDevice(newPrivatekey);
    success++;
  } catch (error) {
    throw error;
  }
}

async function listDevices(token) {
  try {
    let response = await request('http://localhost:8000/devices', {
      auth: {
        bearer: token
      }
    });
    response = JSON.parse(response);

    if (response.devices.length === 0) {
      throw { message: 'Missing devices...' };
    }
    return response;
  } catch (error) {
    throw {
      message: `/devices list
              :- Failed with statuscode ${error.statusCode}
              :- error message: ${error.message}`,
      orginalError: error
    };
  }
}

async function addDevice(credentials) {
  try {
    let response = await request('http://localhost:8000/devices', {
      method: 'POST',
      body: { deviceId: credentials.deviceId, email: credentials.email },
      auth: {
        bearer: credentials.token
      },
      json: true
    });

    const expectations = expect(
      { uuid: 'string', tempPassword: 'string' },
      response
    );

    if (!expectations.wereMet()) {
      throw {
        message: `/devices add did not return expected fields..
            Extra info ${expectations.errors().toString()}`
      };
    }

    return response;
  } catch (error) {
    throw {
      message: `/devices add
              :- Failed with statuscode ${error.statusCode}
              :- error message: ${error.message}`,
      orginalError: error
    };
  }
}

async function verifyDevice(tempInfo, credentials) {
  try {
    let response = await request('http://localhost:8000/devices/verify', {
      method: 'POST',
      body: {
        uuid: tempInfo.uuid,
        deviceId: tempInfo.deviceId,
        temporaryPassword: tempInfo.tempPassword
      },
      json: true
    });
    //TODO expect...dd
    const expectations = expect(
      { privateKey: 'string', deviceId: 'string' },
      response
    );

    if (!expectations.wereMet()) {
      throw {
        message: `/devices/verify did not return expected fields..
            Extra info ${expectations.errors().toString()}`
      };
    }

    return response;
  } catch (error) {
    throw {
      message: `/devices/verify
              :- Failed with statuscode ${error.statusCode}
              :- error message: ${error.message}`,
      orginalError: error
    };
  }
}

async function confirmDevice(credentials) {
  try {
    let response = await request('http://localhost:8000/devices/confirm', {
      method: 'POST',
      body: {
        uuid: credentials.deviceId,
        deviceId: credentials.deviceId,
        deviceName: credentials.deviceName,
        privateKey: credentials.privateKey
      },
      json: true
    });
    const expectations = expect(
      { email: 'string', organization: 'string' },
      response
    );
    if (!expectations.wereMet()) {
      throw {
        message: `/devices/confirm did not return expected fields..
            Extra info ${expectations.errors().toString()}`
      };
    }
    return response;
  } catch (error) {
    throw {
      message: `/devices/verify
              :- Failed with statuscode ${error.statusCode}
              :- error message: ${error.message}`,
      orginalError: error
    };
  }
}

async function updateName(credentials) {
  try {
    let response = await request('http://localhost:8000/devices', {
      method: 'PATCH',
      auth: {
        bearer: credentials.token
      },
      body: {
        deviceId: credentials.deviceId,
        deviceName: 'Update name!'
      },
      json: true
    });
    //reponse is empty
    return response;
  } catch (error) {
    throw {
      message: `/devices patch
                :- Failed with statuscode ${error.statusCode}
                :- error message: ${error.message}`,
      orginalError: error
    };
  }
}

async function deleteDevice(credentials) {
  try {
    let response = await request(
      `http://localhost:8000/devices/${credentials.deviceId}`,
      {
        method: 'DELETE',
        auth: {
          bearer: credentials.token
        }
      }
    );

    return response;
  } catch (error) {
    throw {
      message: `/devices patch
                :- Failed with statuscode ${error.statusCode}
                :- error message: ${error.message}`,
      orginalError: error
    };
  }
}

module.exports = {
  run
};
