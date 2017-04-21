const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Person = mongoose.model('Person', new Schema({
	picture: String, name: String, phoneNumbers: [String], address: [String]
}));

export default Person;


