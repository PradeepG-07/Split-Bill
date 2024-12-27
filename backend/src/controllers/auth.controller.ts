import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { signUpSchema, loginSchema } from "../config/schemas";
import { ApiError } from "../utils/ApiError";
import User from "../models/User.model";
import { ApiResponse } from "../utils/ApiResponse";
import {
	extractZodErrorMessages,
	validateAndReturnMongooseErrors,
} from "../utils/helpers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cleanedEnv from "../config/cleanedEnv";
import { encryptData } from "../utils/encryption";

//Signup Controller
export const signUp = asyncHandler(async (req: Request, res: Response) => {
	const body = req.body;
	//clean the input
	const { data, error } = signUpSchema.safeParse(body);
	if (error) {
		const zodErrors = extractZodErrorMessages(error);
		res.status(422).json(new ApiError(422, "Invalid Params", zodErrors));
		return;
	}

	//Check for existing user
	const existingUser = await User.findOne({
		username: data.username,
	});
	if (existingUser) {
		res.status(409).json(
			new ApiError(409, "User already exists.", ["User already exists"])
		);
		return;
	}

	//Hashing the password
	data.password = bcrypt.hashSync(data.password, 10);

	//create a user and validate the fields
	const newUser = new User(data);
	const mongooseErrors = validateAndReturnMongooseErrors(newUser);

	//if validation fails respond back with errors
	if (mongooseErrors) {
		res.status(422).json(
			new ApiError(422, "Invalid Params", mongooseErrors)
		);
		return;
	}

	//save the user and respond with new user info
	await newUser.save();
	res.status(201).json(
		new ApiResponse(201, newUser, "User created successfully.")
	);
	return;
});

//Login Controller
export const login = asyncHandler(async (req: Request, res: Response) => {
	//clean input
	const { data, error } = loginSchema.safeParse(req.body);
	if (error) {
		const zodErrors = extractZodErrorMessages(error);
		res.status(422).json(new ApiError(422, "Invalid Params", zodErrors));
		return;
	}
	//Check for existing user
	const existingUser = await User.findOne({
		$or: [
			{
				username: data.username_or_email,
			},
			{
				email: data.username_or_email,
			},
		],
	});
	//If user does not exist, respond with invalid credentials
	if (!existingUser) {
		res.status(400).json(
			new ApiError(400, "Bad Request", ["Invalid Credentials."])
		);
		return;
	}
	//Though user exist and password is incorrect, respond with invalid credentials
	const isPasswordCorrect = await existingUser.isPasswordCorrect(
		data.password
	);
	if (!isPasswordCorrect) {
		res.status(400).json(
			new ApiError(400, "Bad Request", ["Invalid Credentials."])
		);
		return;
	}
	//If password is correct, sign a token with encrypted id and send it back
	const encryptedUserId = encryptData(existingUser._id + "");
	const access_token = jwt.sign(
		{ userId: encryptedUserId },
		cleanedEnv!.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "1d",
		}
	);

	//extracting only required details to send to user
	const userDetails = {
		full_name: existingUser.full_name,
		username: existingUser.username,
		email: existingUser.email,
		friends: existingUser.friends,
		profile_pic_url: existingUser.profile_pic_url,
	};

	//set cookie
	res.cookie("access_token", access_token, {
		expires: new Date(Date.now() + 24 * 60 * 60 * 100),
		httpOnly: true,
		secure: true,
	});

	//respond with token also
	res.status(200).json(
		new ApiResponse(
			200,
			{ access_token, user: userDetails },
			"Login successfull."
		)
	);
});

//Logout Controller
export const logout = asyncHandler(async (req: Request, res: Response) => {
	res.cookie("access_token", "", {
		expires: new Date(Date.now() - 24 * 60 * 60),
	});
	res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

