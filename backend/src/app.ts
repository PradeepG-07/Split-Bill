import express from "express";
import cors from "cors";
import cleanedEnv from "./utils/cleanedEnv";
import cookieParser from "cookie-parser";
const app = express();

app.use(
	cors({
		origin: cleanedEnv!.FRONTEND_URI,
	})
);
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// Next step: Configure multer here
app.get("/", (req, res) => {
	res.send("Hello from server");
});

export default app;
