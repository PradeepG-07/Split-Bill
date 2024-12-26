import mongoose from "mongoose";
import "dotenv/config";
import cleanedEnv from "./config/cleanedEnv";
import app from "./app";

mongoose
	.connect(cleanedEnv!.MONGODB_URL, { dbName: cleanedEnv!.DB_NAME })
	.then((connection) => {
		console.log(
			"Connected to MongoDB at ",
			connection.connections[0].host +
				": " +
				connection.connections[0].name
		);
		app.listen(cleanedEnv!.PORT, () => {
			console.log("Server started at port ", cleanedEnv!.PORT);
		});
	})
	.catch((err) => {
		console.log("Error while connecting to MongoDB", err);
	});

