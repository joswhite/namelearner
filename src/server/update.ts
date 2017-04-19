import { spawn } from 'child_process';

export default updateApplication;

function updateApplication() {
    console.log('Updating!');
    let shell = spawn('bash', ['restart.sh'], {stdio: 'ignore', detached: true});
    shell.unref();
}

// If running from command line, start server (without expressApp)
// Ssee http://stackoverflow.com/questions/6398196
if (require.main === module) {
    updateApplication();
}