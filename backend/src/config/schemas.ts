import { z } from "zod";

const envSchema = z.object({
	PORT: z.string({ message: "Port number is required." }),
	MONGODB_URL: z
		.string({ message: "MongoDB URL is required." })
		.url({ message: "MongoDB URL is not a valid url." }),
	DB_NAME: z.string({ message: "DB Name is required." }),
	FRONTEND_URI: z.string({ message: "FRONTEND_URI is required." }),
	ACCESS_TOKEN_SECRET: z.string({
		message: "ACCESS_TOKEN_SECRET is required.",
	}),
	CLOUDINARY_CLOUD_NAME: z.string({
		message: "CLOUDINARY_CLOUD_NAME is required.",
	}),
	CLOUDINARY_API_KEY: z.string({
		message: "CLOUDINARY_API_KEY is required.",
	}),
	CLOUDINARY_API_SECRET: z.string({
		message: "CLOUDINARY_API_SECRET is required.",
	}),
});

export { envSchema };

