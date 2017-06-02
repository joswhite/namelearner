/* Deletes all documents within COLLECTION
   node dist/setup/deleteCollection.js COLLECTION
 */
import mongoose = require('mongoose');
(<any>mongoose).Promise = Promise;
mongoose.connect('mongodb://localhost:27017/namelearner');

import userModel from '../server/models/user.model';
import personModel from '../server/models/person.model';

let collection = process.argv[2];

if (collection === 'users') {
	userModel.remove({}, callback);
}
else if (collection === 'people') {
	personModel.remove({}, callback);
}

function callback(err) {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	else {
		console.log(`Deletion of ${collection} successful`);
		process.exit(0);
	}
}
