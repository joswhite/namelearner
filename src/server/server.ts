import api = require('./api');
import AuthenticateUser from './config/auth';
import bodyParser = require('body-parser');
import connectMongo = require('connect-mongo');
import express = require('express');
import expressSession = require('express-session');
import mongoose = require('mongoose');
import path = require('path');

// App setup
const app = express();
const port = 8020;
const content_dir = path.join(__dirname, '../client');
const MongoStore = connectMongo(expressSession);
let auth = new AuthenticateUser(app, { loginPage: '/login' });

// Logging
app.use(require('morgan')('combined'));

// DB
mongoose.connect('mongodb://localhost:27017/nameLearner');

// Authentication
app.use(bodyParser.urlencoded({ extended: true }));
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
	res.sendFile(path.join(content_dir, './login.html'));
});

app.post('/login', auth.authenticateUser(), function(req, res) {
	res.redirect('/');
});

app.get('/logout', auth.onLogout());

// Other content
app.use('/', auth.ensureLoggedIn());
app.use('/api', api);
app.use('/', express.static(content_dir));

// Error handling (designated by 4-parameter type signature)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error(err.stack);
	res.status(500).send('Server error!');
});

// Start server
app.listen(port, function() {
	console.log('Listening on port ' + port + ', serving ' + content_dir);
});