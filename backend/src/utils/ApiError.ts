import { ZodIssue } from "zod";

export class ApiError extends Error {
	public success: boolean;
	public message: string;
	public statusCode: number;
	public data: null;
	public errors?: string[];
	constructor(
		statusCode: number,
		message = "Something went wrong!",
		errors?: string[],
		stack = ""
	) {
		super(message);
		this.success = false;
		this.statusCode = statusCode;
		this.data = null;
		this.message = message;
		this.errors = errors || [];
		this.stack = stack;
	}
}

