var express = require('express');
var join = require('path').join
var mongoose = require('mongoose');
var port = 8080;

var app = express();

//Static assets
app.use('/', express.static(join(__dirname, "/public")));

//REST API
mongoose.connect('mongodb://localhost:27017/nameLearner');

//Start server
app.listen(port, function() {
    console.log('Listening on port ' + port);
});