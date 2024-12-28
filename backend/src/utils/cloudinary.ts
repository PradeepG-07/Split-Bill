import { v2 as cloudinary, UploadApiErrorResponse } from "cloudinary";
import fs from "fs";
import cleanedEnv from "../config/cleanedEnv";

cloudinary.config({
	cloud_name: cleanedEnv!.CLOUDINARY_CLOUD_NAME,
	api_key: cleanedEnv!.CLOUDINARY_API_KEY,
	api_secret: cleanedEnv!.CLOUDINARY_API_SECRET,
});
const uploadProfilePictureToCloudinary = async (localFilePath: string) => {
	if (!localFilePath || !fs.existsSync(localFilePath)) {
		return {
			profile_pic_url: null,
			error: "File doesnot exist in local storage.",
		};
	}
	try {
		const response = await cloudinary.uploader.upload(localFilePath, {
			upload_preset: "split-bill-app",
			use_filename: true,
			overwrite: true,
		});
		return { profile_pic_url: response.secure_url, error: null };
	} catch (error) {
		return {
			profile_pic_url: null,
			error: (error as UploadApiErrorResponse).message,
		};
	} finally {
		fs.unlinkSync(localFilePath);
	}
};
export default uploadProfilePictureToCloudinary;

