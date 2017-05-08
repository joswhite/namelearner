import * as contentType from 'content-type';
import * as fs from 'fs';
import {PEOPLE_IMAGES_DIR} from '../config/file-system.config';
import * as httpStatus from 'http-status-codes';
import * as mime from 'mime';
import * as path from 'path';
import personModel from '../models/person';

// 200 OK, 201 CREATED, 400 BAD_REQUEST, 401 UNAUTHORIZED, 404 NOT_FOUND
// 200 is implied but we are being verbose here

function handleError(res, err, message, code) {
	let reason = (err && err) ? err : err;
	console.error('Error: ' + reason);
	res.status(code).send(message);
}

export function show(req, res) {
	let id = req.params.id;
	personModel.findById(id, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not find person with id ' + id, httpStatus.NOT_FOUND);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function list(req, res) {
	personModel.find({}, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not retrieve people', httpStatus.INTERNAL_SERVER_ERROR);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function create(req, res) {
	personModel.create(req.body, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not create person or people', httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.CREATED).json(data);
		}
	});
}

export function update(req, res) {
	let id = req.params.id;
	personModel.findByIdAndUpdate(id, req.body, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not update person with id ' + id, httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}

export function upload(req, res) {
	let id = req.params.id;
	let type = contentType.parse(req).type;
	let extension = mime.extension(type);
	let destinationPath = path.join(PEOPLE_IMAGES_DIR, `${id}.${extension}`);
	let file = fs.createWriteStream(destinationPath, 'binary'); // overwrites if exists
	file.on('error', (err: Error) => {
		handleError(res, err, 'Server error in saving image for person with id ' + id,
			httpStatus.INTERNAL_SERVER_ERROR);
	});
	req.pipe(file);
	req.on('end', () => {
		file.close();
		res.status(httpStatus.OK).end('OK+' + id);
	});

}

export function remove(req, res) {
	let id = req.params.id;
	personModel.findByIdAndRemove(id, req.body, function(err, data) {
		if (err) {
			handleError(res, err, 'Could not delete person with id ' + id, httpStatus.BAD_REQUEST);
		}
		else {
			res.status(httpStatus.OK).json(data);
		}
	});
}
