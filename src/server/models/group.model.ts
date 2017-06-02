import * as mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
	name: String,
	owner: String,
	sharedWith: [String]
});

export interface IGroup extends mongoose.Document {
	name: string;
	owner: string;
	sharedWith: string[];
}

export const Group = mongoose.model('Group', GroupSchema);

export default Group;
