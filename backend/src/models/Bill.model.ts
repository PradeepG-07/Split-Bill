import mongoose, { Schema, Document } from "mongoose";

export interface IBill extends Document {
	_id: Schema.Types.ObjectId;
	total_amount: number;
	bill_name: string;
	description?: string;
	invitations: string[];
	status: "waiting" | "approved" | "completed";
	total_active_payers: number;
	individual_amount: number;
	owner_id: Schema.Types.ObjectId;
	payment_link: string;
	amount_transferred_to_owner: number;
}
//Think in a way when all people responded to bill invitation then
//start accepting payments - when every time a user responds to invitation
// go to that bill and check if every invitation is responded
// if yes, generate payment link and update status of bill to active.
const billSchema = new Schema<IBill>(
	{
		total_amount: {
			type: Schema.Types.Number,
			required: [true, "Total Amount is required."],
		},
		bill_name: {
			type: Schema.Types.String,
			trim: true,
			required: [true, "Bill Name is required."],
		},
		description: {
			type: Schema.Types.String,
			trim: true,
		},
		invitations: [
			{
				bill_invitation_id: {
					type: Schema.Types.ObjectId,
					ref: "Bill_Invitation",
				},
			},
		],
		status: {
			type: Schema.Types.String,
			enum: ["waiting", "approved", "completed"],
			required: [true, "Status is required."],
		},
		total_active_payers: {
			type: Schema.Types.Number,
			default: 1,
		},
		individual_amount: {
			type: Schema.Types.Number,
			default: function () {
				return this.total_amount;
			},
		},
		owner_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		payment_link: {
			type: Schema.Types.String, //after bill gets active status generate this link
		},
		amount_transferred_to_owner: {
			type: Schema.Types.Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

billSchema.methods.calculateIndividualAmount = function () {
	this.individual_amount =
		Math.round((this.total_amount * 100) / this.total_active_payers) / 100;
};

const Bill = mongoose.model<IBill>("bill", billSchema);
export default Bill;

