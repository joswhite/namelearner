import { spawn } from 'child_process';
import moment = require('moment');

export default updateApplication;

function updateApplication() {
    let timestamp = moment().format('MMMM Do, h:mm:ss a');
    console.log(`${timestamp}: Updating application via "restart.sh":`);
    let shell = spawn('bash', ['restart.sh'], {stdio: 'ignore', detached: true});
    shell.unref();
}

// If running from command line, start server (without expressApp)
// Ssee http://stackoverflow.com/questions/6398196
if (require.main === module) {
    updateApplication();
}