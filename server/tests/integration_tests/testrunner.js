const flags = require('flags');
const { execSync } = require('child_process');
const registerTest = require('./registration.test');
const loginTest = require('./login.test');
const deviceTest = require('./device.test');
const inviteTest = require('./invite.test');

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
    .then(inviteTest.run);
}

function clean() {
  const buffer = execSync('node dev_cleanup.test.js');
  console.log(String(buffer));
}
