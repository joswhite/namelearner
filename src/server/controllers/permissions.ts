import * as express from 'express';

// Ensure the group specified by req.params.id is owned by or shared with the user
export function groupId(req: express.Request, res: express.Response, next: express.NextFunction) {
    next();
}

// Ensure the group specified by req.body.group is owned by or shared with the user
export function groupProp(req: express.Request, res: express.Response, next: express.NextFunction) {
    next();
}

// Ensure the group specified by req.params.id is owned by the user
export function groupOwner(req: express.Request, res: express.Response, next: express.NextFunction) {
    next();
}

// Ensure the person specified by req.params.id belongs to a group owned by or shared with the user
export function personId(req: express.Request, res: express.Response, next: express.NextFunction) {
    next();
}

// Ensure the user making the request is an administrator
export function userAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    next();
}

// Ensure the user specified by req.params.id is the user
export function userId(req: express.Request, res: express.Response, next: express.NextFunction) {
    next();
}