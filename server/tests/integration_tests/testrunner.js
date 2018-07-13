const flags = require('flags');
const { execSync } = require('child_process');
const registerTest = require('./registration.it');
const loginTest = require('./login.it');
const deviceTest = require('./device.it');
const inviteTest = require('./invite.it');
const documentTest = require('./documents.it');

flags.defineBoolean('register', false);
flags.defineBoolean('clean', false);
flags.parse();

run();

async function run() {
  const runRegister = flags.get('register');
  const runClean = flags.get('clean');

  console.log(
    '##################### INTEGRATION TESTING COMMENCING ######################'
  );

  if (runClean || runRegister) {
    clean();
    if (runClean) {
      process.exit();
    }
  }

  if (runRegister) {
    await registerTest.run();
  }
  loginTest
    .run()
    .then(deviceTest.run)
    .then(inviteTest.run)
    .then(documentTest.run);
}

function clean() {
  const buffer = execSync('node dev_cleanup.it.js');
  console.log(String(buffer));
}
