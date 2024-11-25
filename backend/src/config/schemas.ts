import { z } from "zod";

const envSchema = z.object({
    PORT: z.string({message:"Port number is required."}),
    MONGODB_URL: z.string({message: "MongoDB URL is required."}).url({message: "MongoDB URL is not a valid url."}),
    DB_NAME: z.string({message: "DB Name is required."}),
    FRONTEND_URI: z.string({message: "FRONTEND_URI is required."})
})


export {envSchema};