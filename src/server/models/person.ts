var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Person = mongoose.model('Person', new Schema({
	picture: String, name: String, phoneNumbers: [String], address: [String]
}));

module.exports = Person;


