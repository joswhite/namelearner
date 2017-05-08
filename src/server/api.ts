// Use Express router to route all REST endpoints under the same mount path
import express = require('express');
const router = express.Router();

import * as permissions from './controllers/permissions';
import people = require('./controllers/people');
import users = require('./controllers/users');

// Use traditional naming conventions
router.post('/people/:id/upload', permissions.personId, people.upload);
router.get('/people/:id', permissions.personId, people.show);
router.get('/people', people.list);
router.post('/people', people.create);
router.put('/people/:id', permissions.personId, people.update);
router.delete('/people/:id', permissions.personId, people.remove);

router.get('/users/:id', users.show);
router.get('/users', users.list);
router.post('/users', users.create);
router.put('/users/:id', users.update);
router.delete('/users/:id', users.remove);

// Router will be used by server.ts
export = router;