import fs = require('fs');
import githubWebhookHandler = require('github-webhook-handler');
import http = require('http');
import https = require('https');
import os = require('os');
import path = require('path');

const PROD_PORT_GITHUB_WEBHOOKS = 1739;
const PROD_PORT_HTTP = 80;
const PROD_PORT_HTTPS = 443;
let HOME_DIR = os.homedir();

function getConfigFileContents(file: string): Buffer {
    return fs.readFileSync(path.resolve(HOME_DIR, file));
}

export default startProductionServer;

function startProductionServer(expressApp, callback) {
    // Create https server
    let options = {
        ca: getConfigFileContents('umemorize_me.ca-bundle'),
        key: getConfigFileContents('umemorize_me.key'),
        cert: getConfigFileContents('umemorize_me.crt')
    };

    if(expressApp) {
        https.createServer(options, expressApp).listen(PROD_PORT_HTTPS);
    }

    // Listen for GitHub webhooks
    let handler = githubWebhookHandler({
        path: '/webhook',
        secret: getConfigFileContents('webhook.secret').toString()
    });

    https.createServer(options, (req, res) => {
        handler(req, res, function (err) {
            console.error('Error in processing git webhook post');
            res.statusCode = 404;
            res.end('no such location');
        })
    }).listen(PROD_PORT_GITHUB_WEBHOOKS);

    handler.on('push', function (event) {
        console.log('Received a push event to %s', event.payload.ref);
    });

    // Redirect http to https
    http.createServer((req, res) => {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(PROD_PORT_HTTP);

    if (callback) {
        callback('Production server started!');
    }
}

// If running from command line, start server (without expressApp)
// Ssee http://stackoverflow.com/questions/6398196
if (require.main === module) {
    startProductionServer(null, (result) => { console.log(result); });
}
