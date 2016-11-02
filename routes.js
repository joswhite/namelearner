// Use Express router to route all REST endpoints under the same mount path
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

var people = require('./controllers/people');

// JSON responses are only needed for REST endpoints
router.use(bodyParser.json());

// Use traditional naming conventions
router.get('/people/:id', people.show);
router.get('/people', people.list);
router.post('/people', people.create);
router.put('/people/:id', people.update);
router.delete('/people/:id', people.delete);

// Router will be used by server.js
module.exports = router;