import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		login: { type: String, required: true, unique: true, minLength: 2 },
		password: { type: String, required: true, unique: true, minLength: 8 }
	},
	{ versionKey: false, collection: 'users' }
);

const User = mongoose.model('User', userSchema);

export default User;
