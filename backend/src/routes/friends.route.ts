import { RequestHandler, Router } from "express";
import {
	getAllFriends,
	getAllInvitations,
	respondToInvitation,
	sendInvitation,
} from "../controllers/friends.controller";

const friendsRouter = Router();

friendsRouter.get("/get-all-invitations", getAllInvitations as RequestHandler);
friendsRouter.get("/get-all-friends", getAllFriends as RequestHandler);
friendsRouter.post("/send-invitation", sendInvitation as RequestHandler);
friendsRouter.post(
	"/respond-to-invitation",
	respondToInvitation as RequestHandler
);
export default friendsRouter;

