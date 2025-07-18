import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	address: {
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
	},
});

export const User = mongoose.model("User", userSchema); // api-node - users
