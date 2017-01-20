var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Person = mongoose.model('User', new Schema({
	picture: String, name: String, phoneNumbers: [String], address: [String]
}));

module.exports = Person;


