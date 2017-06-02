import * as mongoose from 'mongoose';
import {IModelRes} from '../repository';
import {IUser} from '../../models/user.model';

export const UserSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    password: String,
    privilegeLevel: Number
});

const User = mongoose.model<IModelRes<IUser>>('Person', UserSchema);

export default User;
