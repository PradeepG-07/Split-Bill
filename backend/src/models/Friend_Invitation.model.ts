import mongoose, { Schema } from "mongoose";

export interface IFriend_Invitation {
	from: string;
	to: string;
	status: "pending";
}
const Friend_Invitation_Schema = new Schema({
	from: {
		type: Schema.Types.String,
		required: true,
	},
	to: {
		type: Schema.Types.String,
		required: true,
	},
	status: {
		type: Schema.Types.String,
		enum: ["pending"],
		default: "pending",
		required: true,
	},
});
const Friend_Invitation = mongoose.model(
	"friend_invitation",
	Friend_Invitation_Schema
);
export default Friend_Invitation;

