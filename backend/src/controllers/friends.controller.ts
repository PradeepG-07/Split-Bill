import { Response } from "express";
import { AuthorizedExpressRequest } from "../config/types";
import asyncHandler from "../utils/asyncHandler";
import User, { IUser } from "../models/User.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import Friend_Invitation from "../models/Friend_Invitation.model";
import { respondToFriendInvitationSchema } from "../config/schemas";
import { extractZodErrorMessages } from "../utils/helpers";
import mongoose from "mongoose";

export const getAllInvitations = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const username = req.user.username;
		const type = req.body?.type;
		if (!type || (type != "sent" && type != "received")) {
			res.status(422).json(
				new ApiError(422, "Invalid params.", [
					"Type of invitation is not specified or wrongly specified.",
				])
			);
			return;
		}
		const filter = type == "sent" ? { from: username } : { to: username };
		const localFieldToCompare = type == "sent" ? "to" : "from";
		const invitations = await Friend_Invitation.aggregate([
			{
				$match: filter,
			},
			{
				$lookup: {
					from: "users",
					localField: localFieldToCompare,
					foreignField: "username",
					as: "userinfo",
				},
			},
			{
				$addFields: {
					from: {
						full_name: { $first: "$userinfo.full_name" },
						username: { $first: "$userinfo.username" },
						profile_pic_url: {
							$first: "$userinfo.profile_pic_url",
						},
					},
					to: {
						full_name: { $first: "$userinfo.full_name" },
						username: { $first: "$userinfo.username" },
						profile_pic_url: {
							$first: "$userinfo.profile_pic_url",
						},
					},
				},
			},
			{
				$unset: [type == "sent" ? "from" : "to", "__v", "userinfo"],
			},
		]);

		res.status(200).json(
			new ApiResponse(
				200,
				{ invitations },
				"Friend Invitations fetched successfully."
			)
		);
	}
);

export const getAllFriends = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const userId = req.user.id;
		const friends = await User.aggregate<IUser>([
			{
				$match: {
					_id: userId,
				},
			},
			{
				$lookup: {
					let: { tempFriendArr: "$friends" },
					from: "users",
					localField: "friends.username",
					foreignField: "username",
					as: "friends",
					pipeline: [
						{
							$addFields: {
								from: {
									$first: "$$tempFriendArr.friends_from",
								},
							},
						},
						{
							$unset: [
								"_id",
								"password",
								"email",
								"__v",
								"createdAt",
								"updatedAt",
								"created_bills",
								"friends",
							],
						},
					],
				},
			},
			{
				$unset: [
					"_id",
					"full_name",
					"username",
					"password",
					"email",
					"created_bills",
					"__v",
					"profile_pic_url",
					"createdAt",
					"updatedAt",
				],
			},
		]);
		res.status(200).json(
			new ApiResponse(
				200,
				friends.length == 0 ? [] : friends[0],
				"Friends fetched successfully."
			)
		);
	}
);

export const sendInvitation = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const fromUsername = req.user.username;
		const toUsername = req.body?.username;
		if (!toUsername.trim() || fromUsername == toUsername) {
			res.status(422).json(
				new ApiError(422, "Invalid params.", [
					"Valid Username is required.",
				])
			);
			return;
		}
		const user = await User.findOne({
			username: toUsername,
		});
		if (!user) {
			res.status(409).json(
				new ApiError(409, "Invalid username.", [
					"User doesnot exist with the username.",
				])
			);
			return;
		}
		const existing_invitaiton = await Friend_Invitation.findOne({
			$or: [
				{ from: fromUsername, to: toUsername },
				{ from: toUsername, to: fromUsername },
			],
		});
		if (existing_invitaiton) {
			res.status(409).json(
				new ApiError(409, "Invitation already exists", [
					"Invitation already exists",
				])
			);
			return;
		}
		const new_invitation = new Friend_Invitation({
			from: fromUsername,
			to: toUsername,
		});
		await new_invitation.save();
		res.status(200).json(
			new ApiResponse(
				200,
				{ invitation: { id: new_invitation._id.toString() } },
				"Friend Invitation sent successfully."
			)
		);
	}
);

export const respondToInvitation = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const username = req.user.username;
		const { data, error } = respondToFriendInvitationSchema.safeParse(
			req.body
		);
		if (error) {
			const zodErrors = extractZodErrorMessages(error);
			res.status(422).json(
				new ApiError(422, "Invalid params.", zodErrors)
			);
			return;
		}
		const invitation = await Friend_Invitation.findById(data.id);
		if (!invitation || invitation.to != username) {
			res.status(400).json(
				new ApiError(400, "Bad request.", [
					"Invalid invitation id or unauthorized request.",
				])
			);
			return;
		}
		if (data.status == "accept") {
			const currentDate = new Date();
			const session = await mongoose.startSession();
			try {
				session.startTransaction();
				const bulkOps = [
					{
						updateOne: {
							filter: { username: invitation.from },
							update: {
								$push: {
									friends: {
										username: invitation.to,
										friends_from: currentDate,
									},
								},
							},
							session,
						},
					},
					{
						updateOne: {
							filter: { username: invitation.to },
							update: {
								$push: {
									friends: {
										username: invitation.from,
										friends_from: currentDate,
									},
								},
							},
							session,
						},
					},
				];

				await User.bulkWrite(bulkOps, { session });
				await Friend_Invitation.findByIdAndDelete(data.id, { session });

				await session.commitTransaction();
				res.status(200).json(
					new ApiResponse(200, {}, "Accepted the invitation.")
				);
			} catch (error) {
				await session.abortTransaction();
				res.status(500).json(
					new ApiResponse(
						500,
						{},
						"Error occurred while accepting invitation. Please try again."
					)
				);
				return;
			} finally {
				await session.endSession();
			}
		} else {
			await Friend_Invitation.findByIdAndDelete(data.id);
			res.status(200).json(
				new ApiResponse(200, {}, "Rejected the invitation.")
			);
		}
	}
);

