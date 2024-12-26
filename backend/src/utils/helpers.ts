import { Document } from "mongoose";
import { ZodError } from "zod";
import crypto from "crypto";

export function validateAndReturnMongooseErrors(
	document: Document
): string[] | null {
	const mongooseErrors = document.validateSync();
	//if validation fails respond back with errors
	if (mongooseErrors) {
		let errors: string[] = [];
		Object.keys(mongooseErrors.errors).map((errored_key) => {
			errors.push(mongooseErrors.errors[errored_key].message);
		});
		return errors;
	}
	return null;
}
export function extractZodErrorMessages(error: ZodError) {
	let errors: string[] = [];
	error.errors.map((error) => {
		errors.push(error.message);
	});
	return errors;
}

