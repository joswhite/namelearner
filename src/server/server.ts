import api = require('./api');
import AuthenticateUser from './config/auth';
import bodyParser = require('body-parser');
import connectMongo = require('connect-mongo');
import express = require('express');
import expressSession = require('express-session');
import fs = require('fs');
import githubWebhookHandler = require('github-webhook-handler');
import http = require('http');
import https = require('https');
import mongoose = require('mongoose');
import os = require('os');
import path = require('path');


// App setup
const DEV_PORT = 8020;
const PROD_PORT_GITHUB_WEBHOOKS = 1739;
const PROD_PORT_HTTP = 80;
const PROD_PORT_HTTPS = 443;
const CONTENT_DIR = path.join(__dirname, '../client');
let app = express();
const MongoStore = connectMongo(expressSession);
let auth = new AuthenticateUser(app, { loginPage: '/login' });
let HOME_DIR = os.homedir();

function getConfigFileContents(file: string): Buffer {
	return fs.readFileSync(path.resolve(HOME_DIR, 'umemorize_me.ca-bundle'));
}

// Logging
app.use(require('morgan')('combined'));

// DB
mongoose.connect('mongodb://localhost:27017/nameLearner');

// Authentication
app.use(bodyParser.urlencoded({ extended: true }));	// For passport-local
app.use(bodyParser.json());							// For REST API
app.use(
	expressSession({
		resave: false,
		secret: 'ff891c94d1a38e1dfe9dbc720c05a6ccc22a9eb6673e0cc8ee2436cc5630560e',
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
	})
);
auth.startPassport();

// Public content
app.get('/login', (req: express.Request, res: express.Response) => {
	res.sendFile(path.join(CONTENT_DIR, './login.html'));
});

app.post('/login', auth.authenticateUser(), function(req, res) {
	res.redirect('/');
});

app.get('/logout', auth.onLogout());

// Other content
app.use('/', auth.ensureLoggedIn());
app.use('/api', api);
app.use('/', express.static(CONTENT_DIR));

// Error handling (designated by 4-parameter type signature)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error(err.stack);
	res.status(500).send('Server error!');
});

// Start server
if (process.env.NAMELEARNER_DEV) {
	let port = DEV_PORT;
	app.listen(port, function() {
		console.log('Listening on port ' + port + ', serving ' + CONTENT_DIR);
	});
}
else {
	// Create https server
	let options = {
		ca: getConfigFileContents('umemorize_me.ca-bundle'),
		key: getConfigFileContents('umemorize_me.key'),
		cert: getConfigFileContents('umemorize_me.crt')
	};

	https.createServer(options, app).listen(PROD_PORT_HTTPS);

	// Listen for GitHub webhooks
	let handler = githubWebhookHandler({
		path: '/webhook',
		secret: getConfigFileContents('webhook.secret')
	});

	https.createServer(options, (req, res) => {
		handler(req, res, function (err) {
			console.error('Error in processing git webhook post');
			res.statusCode = 404;
			res.end('no such location');
		})
	}).listen(PROD_PORT_GITHUB_WEBHOOKS);

	handler.on('push', function (event) {
		console.log('Received a push event for %s to %s', event.payload.ref);
	});

	// Redirect http to https
	http.createServer((req, res) => {
		res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
		res.end();
	}).listen(PROD_PORT_HTTP);

	console.log('Listening on ports ' + PROD_PORT_HTTP + ' and ' + PROD_PORT_HTTPS + ', serving ' + CONTENT_DIR);
}
