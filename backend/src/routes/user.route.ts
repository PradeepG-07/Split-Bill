import { RequestHandler, Router } from "express";
import {
	getDetails,
	getFriendsDetails,
	getOtherUserDetails,
	updateDetails,
	updatePassword,
	updateProfilePic,
} from "../controllers/user.controller";
import { profilePicUpload } from "../middlewares/multer.middleware";

const userRouter = Router();

userRouter.get("/get-details", getDetails as RequestHandler);
userRouter.get("/get-friends-details", getFriendsDetails as RequestHandler);
userRouter.patch("/update-password", updatePassword as RequestHandler);
userRouter.post(
	"/update-profile-pic",
	profilePicUpload.single("new_profile_pic"),
	updateProfilePic as RequestHandler
);
userRouter.put("/update-details", updateDetails as RequestHandler);
userRouter.post(
	"/get-other-user-details",
	getOtherUserDetails as RequestHandler
);

export default userRouter;

