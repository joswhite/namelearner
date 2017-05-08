import api = require('./api');
import AuthenticateUser from './config/auth';
import bodyParser = require('body-parser');
import connectMongo = require('connect-mongo');
import ensureExists from './ensure-exists';
import * as express from 'express';
import expressSession = require('express-session');
import mongoose = require('mongoose');
import path = require('path');
import startProductionServer from './serve.production';

const DEV_PORT = 8020;
const CONTENT_DIR = path.join(__dirname, '../client');

// Ensure required directories exist
ensureExists(path.join(CONTENT_DIR, 'images'));
ensureExists(path.join(CONTENT_DIR, 'images/people'));

// App setup
let app = express();
const MongoStore = connectMongo(expressSession);
let auth = new AuthenticateUser(app, { loginPage: '/login' });
let PRODUCTION_APP: boolean = !process.env.NAMELEARNER_DEV;


// Logging
if (!PRODUCTION_APP) {
	app.use(require('morgan')('combined'));
}

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

// Idea to serve static pages without multiple instances of HTMLWebpackPlugin (look into Jade!)
// dist/public (actually should be out/public)
// app.use('/', express.static(PUBLIC_CONTENT));

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
if (PRODUCTION_APP) {
	startProductionServer(app, (result: string) => {
		console.log(result);
		console.log('Serving ' + CONTENT_DIR + '.');
	});
}
else {
	let port = DEV_PORT;
	app.listen(port, function() {
		console.log('Dev server listening on port ' + port + ', serving ' + CONTENT_DIR);
	});
}
