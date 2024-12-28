import { Response } from "express";
import bcrypt from "bcrypt";
import { AuthorizedExpressRequest } from "../config/types";
import asyncHandler from "../utils/asyncHandler";
import User, { IUser } from "../models/User.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { updateDetailsSchema, updatePasswordSchema } from "../config/schemas";
import { extractZodErrorMessages } from "../utils/helpers";
import uploadProfilePictureToCloudinary from "../utils/cloudinary";
import path from "path";
import fs from "fs";

export const getDetails = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const userId = req.user.id;
		const user = await User.findById(userId)
			.select("-_id -password -createdAt -updatedAt -__v")
			.orFail();
		res.status(200).json(
			new ApiResponse(200, user, "Details fetched successfully.")
		);
	}
);

export const getFriendsDetails = asyncHandler(
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
					from: "users",
					localField: "friends.id",
					foreignField: "_id",
					as: "friends",
					pipeline: [
						{
							$project: {
								_id: 0,
								email: 0,
								password: 0,
								friends: 0,
								created_bills: 0,
								createdAt: 0,
								updatedAt: 0,
								__v: 0,
							},
						},
					],
				},
			},
			{
				$project: {
					_id: 0,
					email: 0,
					password: 0,
					full_name: 0,
					username: 0,
					profile_pic_url: 0,
					created_bills: 0,
					createdAt: 0,
					updatedAt: 0,
					__v: 0,
				},
			},
		]);
		res.status(200).json(
			new ApiResponse(200, friends[0], "Friends fetched successfully.")
		);
	}
);

export const getOtherUserDetails = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const username: string = req.body?.other_user_username;
		if (!username.trim()) {
			res.status(422).json(
				new ApiError(422, "Invalid username.", ["Invalid username."])
			);
			return;
		}
		const user = await User.findOne({
			username: username,
		}).select(
			"-_id -password -createdAt -updatedAt -__v -friends -created_bills -email -profile_pic_url"
		);
		if (!user) {
			res.status(409).json(
				new ApiError(422, "Invalid username.", ["Invalid username."])
			);
			return;
		}
		res.status(200).json(
			new ApiResponse(200, user, "Details fetched successfully.")
		);
	}
);

export const updateDetails = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const userId = req.user.id;
		const { data, error } = updateDetailsSchema.safeParse(req.body);
		if (error) {
			const zodErrors = extractZodErrorMessages(error);
			res.status(422).json(
				new ApiError(422, "Invalid Params.", zodErrors)
			);
			return;
		}
		if (data?.username) {
			const user = await User.findOne<IUser>({ username: data.username });
			if (user && JSON.stringify(userId) != JSON.stringify(user._id)) {
				res.status(409).json(
					new ApiError(409, "Updating details failed.", [
						"Username already exists.",
					])
				);
				return;
			}
		}
		await User.findByIdAndUpdate(userId, {
			full_name: data?.full_name,
			username: data?.username,
			email: data?.email,
		});
		res.status(200).json(
			new ApiResponse(200, data, "Details updated successfully.")
		);
	}
);

export const updateProfilePic = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const userId = req.user.id;
		const localFilePath = path.resolve(
			__dirname,
			"../../tmp/profile-pics/" +
				"ProfilePic-" +
				userId +
				path.extname(req.file?.originalname || "")
		);
		const { profile_pic_url, error } =
			await uploadProfilePictureToCloudinary(localFilePath);
		if (error) {
			res.status(608).json(
				new ApiError(
					608,
					"An error occurred while uploading the file. Please try again.",
					[error]
				)
			);
			return;
		}
		const updatedUser = await User.findByIdAndUpdate(userId, {
			profile_pic_url: profile_pic_url,
		}).orFail();
		res.status(200).json(
			new ApiResponse(
				200,
				{
					profile_pic_url: profile_pic_url,
				},
				"Profile Pic updated successfully."
			)
		);
	}
);

export const updatePassword = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const userId = req.user.id;
		const { data, error } = updatePasswordSchema.safeParse(req.body);
		if (error) {
			const zodErrors = extractZodErrorMessages(error);
			res.status(422).json(
				new ApiError(422, "Invalid params.", zodErrors)
			);
			return;
		}
		const user = await User.findById(userId).orFail();
		const isPasswordCorrect = user.isPasswordCorrect(data.current_password);
		if (!isPasswordCorrect) {
			res.status(606).json(
				new ApiError(606, "Incorrect current password.", [
					"Incorrect current password.",
				])
			);
			return;
		}
		user.password = bcrypt.hashSync(data.new_password, 10);
		await user.save();
		res.status(200).json(
			new ApiResponse(200, {}, "Password updated successfully.")
		);
	}
);

