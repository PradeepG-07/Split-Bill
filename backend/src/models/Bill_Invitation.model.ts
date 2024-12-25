import mongoose, { Document, Schema } from "mongoose";

export interface IBill_Invitation extends Document {
	_id: Schema.Types.ObjectId;
	bill_id: Schema.Types.ObjectId;
	from: Schema.Types.ObjectId;
	to: Schema.Types.ObjectId;
	status: "agreed_to_pay" | "declined_to_pay" | "paid";
	reference_number: string;
}

const billInvitationSchema = new Schema<IBill_Invitation>(
	{
		bill_id: {
			type: Schema.Types.ObjectId,
			ref: "Bill",
			required: [true, "Bill Id is required."],
		},
		from: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "From is required."],
		},
		to: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "To is required."],
		},
		status: {
			type: Schema.Types.String,
			enum: ["sent", "agreed_to_pay", "declined_to_pay", "paid"],
			required: [true, "Status is required."],
		},
		reference_number: {
			type: Schema.Types.String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const Bill_Invitation = mongoose.model<IBill_Invitation>(
	"bill_invitation",
	billInvitationSchema
);
export default Bill_Invitation;

