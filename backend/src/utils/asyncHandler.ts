import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "./ApiError";

export interface asyncRequestHandlerFunction<T = Request> {
	(req: T, res: Response, next: NextFunction): Promise<void>;
}

const asyncHandler = <T = Request>(
	requestHandler: asyncRequestHandlerFunction<T>
) => {
	return async (req: T, res: Response, next: NextFunction) => {
		try {
			await requestHandler(req, res, next);
		} catch (error) {
			res.status((error as ApiError).statusCode || 500).json({
				success: false,
				message: (error as ApiError).message,
			});
		}
	};
};
export default asyncHandler;

