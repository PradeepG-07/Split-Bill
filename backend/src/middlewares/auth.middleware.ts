import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { AuthorizedExpressRequest } from "../config/types";
import User, { IUser } from "../models/User.model";
import cleanedEnv from "../config/cleanedEnv";
import { decryptData } from "../utils/encryption";

const validateUser = async (
	req: AuthorizedExpressRequest,
	res: Response,
	next: NextFunction
) => {
	let token =
		req.cookies?.access_token || req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res
			.status(498)
			.json({ success: false, message: "Invalid or expired token." });
	}
	const decodedToken = <jwt.JwtPayload>(
		await jwt.verify(token, cleanedEnv!.ACCESS_TOKEN_SECRET)
	);
	if (!decodedToken) {
		return res
			.status(498)
			.json({ success: false, message: "Invalid or expired token." });
	}
	//check if user exists with userId
	const userId = new mongoose.Types.ObjectId(
		decryptData(decodedToken.userId)
	);

	const user = await User.findById<IUser>(userId);
	if (!user) {
		return res
			.status(498)
			.json({ success: false, message: "Invalid user id." });
	}
	req.user = { id: user._id };
	next();
};

export default validateUser;

