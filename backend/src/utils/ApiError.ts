export class ApiError extends Error {
	public statusCode: number;
	public data: null;
	public errors: string[];
	constructor(
		statusCode: number,
		message = "Something went wrong!",
		errors = [],
		stack = ""
	) {
		super(message);
		this.statusCode = statusCode;
		this.data = null;
		this.message = message;
		this.errors = errors;
		this.stack = stack;
	}
}
