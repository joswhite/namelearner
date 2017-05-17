import * as express from 'express';

export function personId(req: express.Request, res: express.Response, next: express.NextFunction) {
    // We don't have groups yet, so all users have access to all the people
    // console.log(' Requested permission for ' + req.params.id);
    next();
}