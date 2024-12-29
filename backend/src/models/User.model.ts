import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
	_id: Schema.Types.ObjectId;
	full_name: string;
	username: string;
	email: string;
	profile_pic_url: string;
	password: string;
	created_bills: Schema.Types.ObjectId[];
	friends: string[];
	isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		full_name: {
			type: Schema.Types.String,
			trim: true,
			lowercase: true,
			required: [true, "Full name is required."],
		},
		username: {
			type: Schema.Types.String,
			trim: true,
			lowercase: true,
			required: [true, "Username is required."],
			unique: true,
		},
		email: {
			type: Schema.Types.String,
			trim: true,
			lowercase: true,
			unique: true,
			required: [true, "Email is required."],
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please fill a valid email address",
			],
		},
		profile_pic_url: {
			type: Schema.Types.String,
			default:
				"https://res.cloudinary.com/deeetmc3c/image/upload/v1735126244/split-bill-app/profile-images/default.png",
		},
		password: {
			type: Schema.Types.String,
			required: true,
			minlength: [6, "Password should contain at least 6 characters."],
		},
		created_bills: [
			{
				bill_id: {
					type: Schema.Types.ObjectId,
					ref: "Bill",
				},
			},
		],
		friends: [
			{
				username: {
					type: Schema.Types.String,
				},
				friends_from: {
					type: Schema.Types.Date,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

userSchema.methods.isPasswordCorrect = async function (userPassword: string) {
	return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model<IUser>("user", userSchema);
export default User;

