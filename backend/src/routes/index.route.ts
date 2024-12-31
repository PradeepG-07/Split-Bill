import { RequestHandler, Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import validateUser from "../middlewares/auth.middleware";
import friendsRouter from "./friends.route";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/user", validateUser as RequestHandler, userRouter);
mainRouter.use("/friends", validateUser as RequestHandler, friendsRouter);
export default mainRouter;

