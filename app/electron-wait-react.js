const net = require('net');
const port = process.env.PORT ? process.env.PORT - 100 : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () =>
  client.connect(
    { port: port },
    () => {
      client.end();
      if (!startedElectron) {
        console.log('starting electron');
        startedElectron = true;
        const spawn = require('child_process').spawn;
        const npm = spawn('npm', ['run', 'electron-dev']);

        npm.stdout.on('data', data => {
          console.log('out: ', data.toString());
        });

        npm.stderr.on('data', data => {
          console.log('err: ', data.toString());
        });

        npm.on('close', code => {
          console.log('Electron stoped with code', code.toString());
        });
      }
    }
  );

tryConnection();

client.on('error', error => {
  console.log('Still waiting for react..');
  setTimeout(tryConnection, 1000);
});
