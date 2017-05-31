// Users for the application.

import PRIVILEGES from '../config/privileges.config';
import userModel from '../models/user';
import * as httpStatus from 'http-status-codes';

function handleError(res, err, message, code) {
	let reason = (err && err.message) ? err.message : err;
	console.error('Error: ' + reason);
	res.status(code).send(message);
}

export function show(req, res) {
	let id = req.params.id;
	userModel.findById(id, function(err, data) {
		if (err || !data) {
			handleError(res, err, 'Could not find user with id ' + id, httpStatus.NOT_FOUND);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function list(req, res) {
	userModel.find({}, function(err, data) {
		if (err || !data) {
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
		if (err || !data) {
			handleError(res, err, 'Could not create user', httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.CREATED).json(data);
		}
	});
}

export function update(req, res) {
	let id: string = req.params.id;
	req.body.privilegeLevel = PRIVILEGES.BASIC;
	userModel.findByIdAndUpdate(id, req.body, {new: true}, function(err, data) {
		if (err || !data) {
			return handleError(res, err, 'Could not update user with id ' + id, httpStatus.BAD_REQUEST);
		}

		res.status(httpStatus.OK).json(data);
	});
}

export function remove(req, res) {
	let id = req.params.id;
	userModel.findByIdAndRemove(id, function(err, data) {
		if (err || !data) {
			handleError(res, err, 'Could not delete user with id ' + id, httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}
