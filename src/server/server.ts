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
	userModel.findById(id, function (error, user) {
		if (error) { return callback(error); }
		callback(null, user);
	});
});


// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
	function(req, res) {
		res.render('home', { user: req.user });
	});

app.get('/login',
	function(req, res){
		res.render('login');
	});

app.post('/login',
	passport.authenticate('local', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	});

app.get('/logout',
	function(req, res){
		req.logout();
		res.redirect('/');
	});

app.get('/profile',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
		res.render('profile', { user: req.user });
	});

app.listen(3000);
