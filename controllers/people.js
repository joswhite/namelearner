var personModel = require('../models/person');
var httpStatus = require('http-status-codes');
// 200 OK, 201 CREATED, 400 BAD_REQUEST, 401 UNAUTHORIZED, 404 NOT_FOUND
// 200 is implied but we are being verbose here

var controller = {};

function handleError(res, reason, message, code) {
	console.error('Error: ' + reason);
	res.status(code).send(message);
}

controller.show = function(req, res, next) {
	var id = req.params.id;
	personModel.findById(id, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not find person with id ' + id, httpStatus.NOT_FOUND);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
};

controller.list = function(req, res, next) {
	personModel.find({}, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not retrieve people', httpStatus.INTERNAL_SERVER_ERROR);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
};

controller.create = function(req, res, next) {
	personModel.create(req.body, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not create person or people', httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.CREATED).json(data);
		}
	});
};

controller.update = function(req, res, next) {
	var id = req.params.id;
	personModel.findByIdAndUpdate(id, req.body, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not update person with id ' + id, httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
};

controller.delete = function(req, res, next) {
	var id = req.params.id;
	personModel.findByIdAndRemove(id, req.body, function(err, data) {
		if (err) {
			handleError(res, err.message, 'Could not delete person with id ' + id, httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
};

module.exports = controller;
