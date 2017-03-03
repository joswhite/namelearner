import api = require('./api');
import bodyParser = require('body-parser');
import express = require('express');
import mongoose = require('mongoose');
import passport = require('passport');
import passportLocal = require('passport-local');
import path = require('path');
let userModel = require('./models/user');

// App setup
const app = express();
const port = 8020;
const content_dir = path.join(__dirname, '../client');
let Strategy = passportLocal.Strategy;

// Logging
app.use(require('morgan')('combined'));
let term = require('./dev/term')(function (expr) { return eval(expr); }, 'server');	//$debug

// DB
mongoose.connect('mongodb://localhost:27017/nameLearner');

// Passport
passport.use(new Strategy((username, password, callback) => {
	userModel.findOne({ username: username }, function(error, user) {
		if (error) { return callback(error); }
		//TODO: https://code.ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
		//let passwordHash = '44';
		//if (user.password.hash != passwordHash) { return callback(null, false); }
		if (user.password != password) { return callback(null, false); }
		return callback(null, user);
	});
}));

passport.serializeUser(function(user: {id: string}, callback) {
	callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
	userModel.findById(id, function(err, user) {
		if (err) { return callback(err); }
		else { callback(null, user); }
	});
});

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Public/login
app.get('/login', (req: express.Request, res: express.Response) => {
	console.log('Static file');
	res.sendFile(path.join(content_dir, './login.html'));
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login2' } ),
    function(req, res) {
		res.redirect('/');
    }
);



// REST API
app.use('/api', api);


// Other static content
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
