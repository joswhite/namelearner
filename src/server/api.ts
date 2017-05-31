// Use Express router to route all REST endpoints under the same mount path
import express = require('express');
const router = express.Router();

import * as groups from './controllers/groups';
import * as permissions from './controllers/permissions';
import * as people from './controllers/people';
import * as users from './controllers/users';

// Notes on permissions:
// - Full user API, list: only available to admins
// - Show/update/remove:  only available to users with permissions on group
// - User-specific:       only available to the user

// router.get('/groups/:id/members', permissions.groupId, groups.listPeople);
router.get('/groups/:id', permissions.groupId, groups.show);
router.get('/groups', permissions.userAdmin, groups.list);
router.post('/groups', groups.create);
router.put('/groups/:id', permissions.groupOwner, groups.update);
router.delete('/groups/:id', permissions.groupOwner, groups.remove);

router.post('/people/:id/upload', permissions.personId, people.upload);
router.get('/people/:id', permissions.personId, people.show);
router.get('/people', permissions.userAdmin, people.list);
router.post('/people', permissions.groupProp, people.create);
router.put('/people/:id', permissions.personId, people.update);
router.delete('/people/:id', permissions.personId, people.remove);

// router.get('/users/:id/groups', permissions.userId, users.listGroups);
// router.get('/users/:id/people', permissions.userId, users.listPeople);
// router.get('/users/:id/users', permissions.userId, users.listUsers);
router.get('/users/:id', permissions.userAdmin, users.show);
router.get('/users', permissions.userAdmin, users.list);
router.post('/users', permissions.userAdmin, users.create);
router.put('/users/:id', permissions.userAdmin, users.update);
router.delete('/users/:id', permissions.userAdmin, users.remove);

// Router will be used by server.ts
export = router;