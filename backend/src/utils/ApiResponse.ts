import { Document } from "mongoose";
export class ApiResponse {
	public statusCode: number;
	public message: string;
	public data: object | Document;
	public success: boolean;
	constructor(
		statusCode: number,
		data: object | Document = {},
		message = "Success"
	) {
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
		this.success = statusCode < 400;
	}
}

