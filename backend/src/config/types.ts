import { Request } from "express";
export type AuthorizedExpressRequest = Request & { user: { id?: string } };

declare module "jsonwebtoken" {
	export interface JwtPayload {
		userId: string;
	}
}

