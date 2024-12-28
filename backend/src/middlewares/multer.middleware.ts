import multer from "multer";
import path from "path";
import { AuthorizedExpressRequest } from "../config/types";
import { Response, NextFunction } from "express";

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

export const profilePicUpload = multer({
	storage: profile_pic_storage,
	limits: {
		fileSize: 100 * 1000, //100kb
	},
});

