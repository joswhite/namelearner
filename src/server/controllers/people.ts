var personModel = require('../models/person');
var httpStatus = require('http-status-codes');
// 200 OK, 201 CREATED, 400 BAD_REQUEST, 401 UNAUTHORIZED, 404 NOT_FOUND
// 200 is implied but we are being verbose here

function handleError(res, reason, message, code) {
	console.error('Error: ' + reason);
	res.status(code).send(message);
}

export function show(req, res) {
	var id = req.params.id;
	personModel.findById(id, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not find person with id ' + id, httpStatus.NOT_FOUND);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function list(req, res) {
	personModel.find({}, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not retrieve people', httpStatus.INTERNAL_SERVER_ERROR);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function create(req, res) {
	personModel.create(req.body, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not create person or people', httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.CREATED).json(data);
		}
	});
}

export function update(req, res) {
	var id = req.params.id;
	personModel.findByIdAndUpdate(id, req.body, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not update person with id ' + id, httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function remove(req, res) {
	var id = req.params.id;
	personModel.findByIdAndRemove(id, req.body, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not delete person with id ' + id, httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}
