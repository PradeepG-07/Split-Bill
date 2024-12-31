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

const signUpSchema = z.object({
	full_name: z.string({ message: "Full Name is required." }),
	email: z
		.string({ message: "Email is required." })
		.email("Invalid email format."),
	username: z.string({ message: "Username is required." }),
	password: z
		.string({ message: "Password is required." })
		.min(6, "Password should contain at least 6 characters."),
});

const loginSchema = z.object({
	username_or_email: z.string({ message: "Username or Email is required." }),
	password: z.string({ message: "Password is required." }),
});

const updatePasswordSchema = z.object({
	current_password: z.string({ message: "Current Password is required." }),
	new_password: z
		.string({ message: "New password is required." })
		.min(6, "Password should contain at least 6 characters."),
});

const updateDetailsSchema = z.object({
	full_name: z.string().optional(),
	username: z.string().optional(),
	email: z.string().email({ message: "Invalid email format." }).optional(),
});

const respondToFriendInvitationSchema = z.object({
	id: z.string({ message: "Friend Invitation id required." }),
	status: z.enum(["accept", "reject"], { message: "Invalid status." }),
});
export {
	envSchema,
	signUpSchema,
	loginSchema,
	updatePasswordSchema,
	updateDetailsSchema,
	respondToFriendInvitationSchema,
};

