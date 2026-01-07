// Bootstrap file - ensures electron module is fully loaded before main
const electron = require('electron');

// Give electron a tick to fully initialize its exports
setImmediate(() => {
  // Verify electron loaded correctly
  if (!electron.app) {
    console.error('ERROR: Electron app object is undefined!');
    console.error('This indicates an Electron initialization issue.');
    process.exit(1);
  }

  // Now load main
  require('./main');
});
