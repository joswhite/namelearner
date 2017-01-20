// Use Express router to route all REST endpoints under the same mount path
import express = require('express');
const router = express.Router();

import people = require('./controllers/people');

// Use traditional naming conventions
router.get('/people/:id', people.show);
router.get('/people', people.list);
router.post('/people', people.create);
router.put('/people/:id', people.update);
router.delete('/people/:id', people.remove);

// Router will be used by server.ts
export = router;