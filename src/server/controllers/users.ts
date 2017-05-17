// Users for the application.
// Because the usernames should be unique, we use them for show, create, update, and delete operations.
// You can only create one user at a time

import PRIVILEGES from '../config/privileges.config';
import userModel from '../models/user';
import * as httpStatus from 'http-status-codes';
// 200 OK, 201 CREATED, 400 BAD_REQUEST, 401 UNAUTHORIZED, 404 NOT_FOUND
// 200 is implied but we are being verbose here

function handleError(res, err, message, code) {
	let reason = (err && err.message) ? err.message : err;
	console.error('Error: ' + reason);
	res.status(code).send(message);
}

export function show(req, res) {
	let username = req.params.username;
	userModel.findOne({ username: username }, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not find user with username ' + username, httpStatus.NOT_FOUND);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function list(req, res) {
	userModel.find({}, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not retrieve users', httpStatus.INTERNAL_SERVER_ERROR);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function create(req, res) {
	// Check the user doesn't already exist (expect findOne to return an error)
	let username = req.body.username;
	userModel.findOne({ username: username }, function(err, data) {
		if (data) {
			handleError(res, data, 'Could not create user with username ' + username +
				' because one with that username already exists', httpStatus.CONFLICT);
		}
		else {
			createUser(req, res);
		}
	});
}

function createUser(req, res) {
	req.body.privilegeLevel = PRIVILEGES.BASIC;
	userModel.create(req.body, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not create user', httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.CREATED).json(data);
		}
	});
}

export function update(req, res) {
	let username = req.params.username;
	req.params.privilegeLevel = PRIVILEGES.BASIC;
	userModel.findOneAndUpdate({ username: username }, req.body, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not update user with username ' + username, httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function remove(req, res) {
	let username = req.params.username;
	userModel.findOneAndRemove({ username: username }, req.body, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not delete user with username ' + username, httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}
