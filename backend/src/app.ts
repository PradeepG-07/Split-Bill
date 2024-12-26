import express from "express";
import cors from "cors";
import cleanedEnv from "./config/cleanedEnv";
import cookieParser from "cookie-parser";
import mainRouter from "./routes/index.route";
const app = express();

app.use(
	cors({
		origin: cleanedEnv!.FRONTEND_URI,
	})
);
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// Next step: create a signup endpoint in controller.
app.get("/", (req, res) => {
	res.send("Hello from server");
});

app.use("/api/v1", mainRouter);

export default app;

