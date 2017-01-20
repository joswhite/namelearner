// TODO: <reference path="../node_modules/@types/es6-shim/index.d.ts"/>
// Structured similar to "A TDD Approach to Building a To-do API Using Node.js and MongoDB"
// on www.semaphoreci.com.
import bodyParser = require('body-parser');
import express = require('express');
import mongoose = require('mongoose');
import path = require('path');
import routes = require('./routes');

// App setup
const app = express();
const port = 8020;

// DB
mongoose.connect('mongodb://localhost:27017/nameLearner');

// REST API
app.use(bodyParser.json());
app.use('/api', routes);

// Static content
var content_dir = path.join(__dirname, '../client');
app.use('/', express.static(content_dir));

// Error handling (designated by 4-parameter type signature)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Server error!');
});

// Start server
app.listen(port, function() {
    console.log('Listening on port ' + port + ', serving ' + content_dir);
});
