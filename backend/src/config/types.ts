import { Request } from "express";
import { Schema } from "mongoose";
export type AuthorizedExpressRequest = Request & {
	user: { id: Schema.Types.ObjectId };
};

declare module "jsonwebtoken" {
	export interface JwtPayload {
		userId: string;
	}
}

