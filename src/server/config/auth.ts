import connectEnsureLogin = require('connect-ensure-login');
import express = require('express');
import passport = require('passport');
import passportLocal = require('passport-local');

let Strategy = passportLocal.Strategy;
let userModel = require('../models/user');

export interface AuthOptions {
	loginPage: string;
}

export default class AuthenticateUser {
	private Strategy = new Strategy((username, password, callback) => {
		userModel.findOne({ username: username }, function(error, user) {
			if (error) { return callback(error); }
			//TODO: https://code.ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
			//let passwordHash = '44';
			//if (user.password.hash != passwordHash) { return callback(null, false); }
			if (!user || user.password != password) { return callback(null, false); }
			return callback(null, user);
		});
	});

	constructor(private expressApp: express.Express, private options: AuthOptions) {
		passport.use(this.Strategy);

		passport.serializeUser(function(user: {id: string}, callback) {
			callback(null, user.id);
		});

		passport.deserializeUser(function(id, callback) {
			userModel.findById(id, function (error, user) {
				if (error) { return callback(error); }
				callback(null, user);
			});
		});
	}

	authenticateUser() {
		return passport.authenticate('local', { failureRedirect: this.options.loginPage });
	}

	startPassport() {
		this.expressApp.use(passport.initialize());
		this.expressApp.use(passport.session());
	}

	ensureLoggedIn() {
		return connectEnsureLogin.ensureLoggedIn(this.options.loginPage);
	}
}