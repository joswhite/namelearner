import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

const SALT_ROUNDS = 5;

const UserSchema = new mongoose.Schema({
	name: String,
	username: String,
	password: String,
	privilegeLevel: Number
});

export interface IUser extends mongoose.Document {
	name: string;
	username: string;
	password: string;
	privilegeLevel: number;
	verifyPassword: (string, Function) => null;
}

UserSchema.pre('save', hashPassword);
UserSchema.pre('findOneAndUpdate', hashPassword);

// Hash passwords before saving them
function hashPassword(callback) {
	let user = this;

	// Break out if the password hasn't changed (method only present on 'findOneAndUpdate')
	if (user.isModified != null && !user.isModified('password')) {
		return callback();
	}

	// Password changed so we need to hash it.
	bcrypt.hash(user.password, SALT_ROUNDS).then((hash) => {
		user.password = hash;
		callback();
	});
}

// Verify passwords
// Use "function" instead of "=>" to stop TS from compiling this to _this
// See http://blog.simontimms.com/2013/01/28/this-vs-_this-in-typescript/
UserSchema.methods.verifyPassword = function(password: string, callback) {
	bcrypt.compare(password, this.password, (err: Error, isMatch: boolean) => {
		if (err) {
			return callback(err);
		}

		callback(null, isMatch);
	});
};

export const User = mongoose.model('User', UserSchema);

export default User;