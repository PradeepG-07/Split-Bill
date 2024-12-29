import { Request } from "express";
import { Schema } from "mongoose";
export interface AuthorizedExpressRequest extends Request {
	user: { id: Schema.Types.ObjectId; username: string };
}

declare module "jsonwebtoken" {
	export interface JwtPayload {
		userId: string;
	}
}

