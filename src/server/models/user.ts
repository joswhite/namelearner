var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.model('User', new Schema({
	name: String,
	username: String,
	password: String,
	privilegeLevel: Number
	/*password: { salt: String, hash: String }*/
}));

module.exports = User;


