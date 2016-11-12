// Structured similar to "A TDD Approach to Building a Todo API Using Node.js and MongoDB"
// on www.semaphoreci.com.
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var join = require('path').join;
var routes = require('./routes');

// App setup
var app = express();
var port = 8080;

// DB
mongoose.connect('mongodb://localhost:27017/nameLearner');

// REST API
app.use(bodyParser.json());
app.use('/api', routes);

// Static content
app.use('/', express.static(join(__dirname, 'public')));

// Error handling (designated by 4-parameter type signature)
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Server error!');
});

// Start server
app.listen(port, function() {
    console.log('Listening on port ' + port);
});
