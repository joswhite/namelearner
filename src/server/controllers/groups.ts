import * as httpStatus from 'http-status-codes';
import groupModel, {IGroup} from '../models/group';

function handleError(res, err, message, code) {
    let reason = (err && err) ? err : err;
    console.error('Error: ' + reason);
    res.status(code).send(message);
}

export function show(req, res) {
    let id = req.params.id;
    groupModel.findById(id, function(err, data) {
        if (err || !data) {
            handleError(res, err, 'Could not find group with id ' + id, httpStatus.NOT_FOUND);
        }
        else {
            res.status(httpStatus.OK).json(data);
        }
    });
}

export function list(req, res) {
    groupModel.find({}, function(err, data) {
        if (err || !data) {
            handleError(res, err, 'Could not retrieve groups', httpStatus.INTERNAL_SERVER_ERROR);
        }
        else {
            res.status(httpStatus.OK).json(data);
        }
    });
}

export function create(req, res) {
    groupModel.create(req.body, function(err, data) {
        if (err || !data) {
            handleError(res, err, 'Could not create group or groups', httpStatus.BAD_REQUEST);
        }
        else {
            res.status(httpStatus.CREATED).json(data);
        }
    });
}

export function update(req, res) {
    let id: string = req.params.id;
    groupModel.findByIdAndUpdate(id, req.body, {new: true}, function(err, data) {
        if (err || !data) {
            return handleError(res, err, 'Could not update group with id ' + id, httpStatus.BAD_REQUEST);
        }

        res.status(httpStatus.OK).json(data);
    });
}

export function remove(req, res) {
    let id = req.params.id;
    groupModel.findByIdAndRemove(id, function(err, data) {
        if (err || !data) {
            handleError(res, err, 'Could not delete group with id ' + id, httpStatus.BAD_REQUEST);
        }
        else {
            res.status(httpStatus.OK).json(data);
        }
    });
}
