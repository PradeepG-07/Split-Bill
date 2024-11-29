import { NextFunction, Request, Response } from "express";
import { ApiError } from "./ApiError";

interface asyncRequestHandlerFunction {
	(req: Request, res: Response, next: NextFunction): Promise<void>;
}

const asyncHandler = (requestHandler: asyncRequestHandlerFunction) => {
	return async (req: Request, res: Response, next: NextFunction) => {
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
