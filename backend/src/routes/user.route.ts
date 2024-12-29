import { RequestHandler, Router } from "express";
import {
	getDetails,
	getOtherUserDetails,
	updateDetails,
	updatePassword,
	updateProfilePic,
} from "../controllers/user.controller";
import { profilePicUpload } from "../middlewares/multer.middleware";

const userRouter = Router();

userRouter.get("/get-details", getDetails as RequestHandler);
userRouter.patch("/update-password", updatePassword as RequestHandler);
userRouter.post(
	"/update-profile-pic",
	profilePicUpload as RequestHandler,
	updateProfilePic as RequestHandler
);
userRouter.put("/update-details", updateDetails as RequestHandler);
userRouter.post(
	"/get-other-user-details",
	getOtherUserDetails as RequestHandler
);

export default userRouter;

