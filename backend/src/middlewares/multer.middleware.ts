import multer from "multer";
import path from "path";
import { AuthorizedExpressRequest } from "../config/types";
import { Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

const profile_pic_storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, "./tmp/profile-pics");
	},
	filename(req: AuthorizedExpressRequest, file, callback) {
		const fileName = "ProfilePic-" + new String(req.user.id);
		const fileExtension = path.extname(file.originalname);
		const validExtensions = ".png .jpg .jpeg .gif .avif .svg";

		if (!validExtensions.includes(fileExtension)) {
			console.log("Invalid extensions");
			callback(new Error("Invalid file type."), "");
		}
		callback(null, fileName + fileExtension);
	},
});

const profilePicUploadSettings = multer({
	storage: profile_pic_storage,
	limits: {
		fileSize: 100 * 1000, //100kb
	},
});

export function profilePicUpload(
	req: AuthorizedExpressRequest,
	res: Response,
	next: NextFunction
) {
	const upload = profilePicUploadSettings.single("new_profile_pic");

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			res.status(500).json(
				new ApiError(500, "Error uploading file", [err.code], err.stack)
			);
			return;
		} else if (err) {
			// An unknown error occurred when uploading.
			res.status(500).json(
				new ApiError(500, "Internal Server Error", [
					"Internal Server Error",
				])
			);
			return;
		}
		next();
	});
}

