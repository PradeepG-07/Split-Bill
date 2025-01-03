import mongoose from "mongoose";
import "dotenv/config";
import cleanedEnv from "./config/cleanedEnv";
import app from "./app";

mongoose
	.connect(cleanedEnv!.MONGODB_URL, {
		dbName: cleanedEnv!.DB_NAME,
		replicaSet: "rs0", //to use transactions replicaSet has to be used and directConnection need to be true incase of db inside of docker.
		directConnection: true,
	})
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

