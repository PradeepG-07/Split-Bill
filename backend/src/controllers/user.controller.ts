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

export const getOtherUserDetails = asyncHandler(
	async (req: AuthorizedExpressRequest, res: Response) => {
		const username: string = req.body?.other_user_username;
		if (!username.trim()) {
			res.status(422).json(
				new ApiError(422, "Invalid params.", ["Username is required."])
			);
			return;
		}
		const user = await User.findOne({
			username: username,
		}).select(
			"-_id -password -createdAt -updatedAt -__v -friends -created_bills -email"
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
			const existingUserWithUsername = await User.findOne<IUser>({
				username: data.username,
			});
			if (
				existingUserWithUsername &&
				JSON.stringify(userId) !=
					JSON.stringify(existingUserWithUsername._id)
			) {
				res.status(409).json(
					new ApiError(409, "Updating details failed.", [
						"Username already exists.",
					])
				);
				return;
			}
		}
		if (data?.email) {
			const existingUserWithEmail = await User.findOne<IUser>({
				email: data.email,
			});
			if (
				existingUserWithEmail &&
				JSON.stringify(userId) !=
					JSON.stringify(existingUserWithEmail._id)
			) {
				res.status(409).json(
					new ApiError(409, "Updating details failed.", [
						"Email already exists.",
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
		const isPasswordCorrect = await user.isPasswordCorrect(
			data.current_password
		);
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

