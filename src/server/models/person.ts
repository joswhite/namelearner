import * as async from 'async';
import * as fs from 'fs';
import * as mongoose from 'mongoose';
import * as path from 'path';
import {DEFAULT_PERSON_PICTURE, PEOPLE_IMAGES_DIR} from '../config/file-system.config';

const PersonSchema = new mongoose.Schema({
	address: [String],
	group: String,
	name: String,
	phoneNumbers: [String],
	picture: String
});

export interface IPerson extends mongoose.Document {
	address: string[];
	group: string;
	name: string;
	phoneNumbers: string[];
	picture: string;	// Should only be set via image POST (uses setPicture method)
}

export interface IPersonModel extends mongoose.Model<IPerson> {
	setPicture: (id: string, picture: string, callback: (err: Error) => void) => void;
}

// Set a person's picture. If it has changed and was not the default picture, delete the old file
PersonSchema.statics.setPicture = function(id: string, picture: string, callback: (err: Error) => null) {
	this.findById(id, (err: Error, person: IPerson) => {
		if (err) {
			return callback(err);
		}

		let oldPicture = person.picture;
		if (oldPicture === picture) {
			return callback(null);
		}

		person.picture = picture;
		let asyncTasks: Function[] = [ person.save.bind(person) ];

		if (oldPicture !== DEFAULT_PERSON_PICTURE) {
			let oldPicturePath = path.join(PEOPLE_IMAGES_DIR, oldPicture);
			let task = fs.unlink.bind(fs, oldPicturePath);
			asyncTasks.push(task);
		}

		async.parallel(asyncTasks, (err: Error) => {
			if (err && err['code'] != 'ENOENT') {
				return callback(err);
			}
			else {
				return callback(null);
			}
		});
	});
};

const Person = mongoose.model('Person', PersonSchema);

export default <IPersonModel>Person;
