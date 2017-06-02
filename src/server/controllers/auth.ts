import connectEnsureLogin = require('connect-ensure-login');
import express = require('express');
import passport = require('passport');
import passportLocal = require('passport-local');
import { IUser, User } from '../models/user.model';

let Strategy = passportLocal.Strategy;

export interface AuthOptions {
	loginPage: string;
}

export default class AuthenticateUser {
	private Strategy = new Strategy((username, password, callback) => {
		User.findOne({ username: username }, function(error: Error, user: IUser) {
			if (error) { return callback(error); }
			if (!user) { return callback(null, false); }

			user.verifyPassword(password, (err: Error, isMatch: boolean) => {
				if (err) { return callback(err); }
				if (!isMatch) { return callback(null, false); }

				return callback(null, user);
			});
		});
	});

	constructor(private expressApp: express.Express, private options: AuthOptions) {
		passport.use(this.Strategy);

		passport.serializeUser(function(user: {id: string}, callback) {
			callback(null, user.id);
		});

		passport.deserializeUser(function(id, callback) {
			User.findById(id, function (error, user) {
				if (error) { return callback(error); }
				callback(null, user);
			});
		});
	}

	authenticateUser() {
		return passport.authenticate('local', { failureRedirect: this.options.loginPage });
	}

	ensureLoggedIn() {
		return connectEnsureLogin.ensureLoggedIn(this.options.loginPage);
	}

	onLogout() {
		let loginPage = this.options.loginPage;	// Removes need for caller to bind to the object
		return (req, res) => {
			req.logout();
			res.redirect(loginPage);
		}
	}

	startPassport() {
		this.expressApp.use(passport.initialize());
		this.expressApp.use(passport.session());
	}
}