import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthorizedExpressRequest } from "../config/types";
import User, { IUser } from "../models/User.model";
import cleanedEnv from "../config/cleanedEnv";
import { decryptData } from "../utils/encryption";

const authMiddleWare = async (
	req: AuthorizedExpressRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies?.token || req.headers.authorization?.split(" ");
	const decodedToken = <jwt.JwtPayload>(
		await jwt.verify(token, cleanedEnv!.ACCESS_TOKEN_SECRET)
	);
	if (!decodedToken) {
		return res
			.status(401)
			.json({ success: false, message: "Unauthorized user." });
	}
	//check if user exists with userId
	const userId = decryptData(decodedToken.userId);
	const user = await User.findById<IUser>(userId);
	if (!user) {
		return res
			.status(401)
			.json({ success: false, message: "Unauthorized user." });
	}
	req.user.id = user._id;
	next();
};

