import mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nameLearner');
let userModel = require('../server/models/user');
let privileges = require('../server/config/privileges');

let user = {
	privilegeLevel: privileges.ADMIN,
	name: 'Administrator',
	username: process.argv[2],
	password: process.argv[3]
};

// Check the user doesn't already exist (expect findOne to return an error)
let username = user.username;
userModel.findOne({ username: username }, function(err, data) {
	if (data) {
		console.error('User already exists!', data);
		process.exit(1);
	}
	else {
		createUser();
	}
});

// Create user
function createUser() {
	userModel.create(user, function(err, data) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		else {
			console.log('Creation successful', data);
			process.exit(0);
		}
	});
}
