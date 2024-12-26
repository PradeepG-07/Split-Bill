import { Router } from "express";
import { login, logout, signUp } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

export default authRouter;

