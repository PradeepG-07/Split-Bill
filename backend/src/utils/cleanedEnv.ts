import { ZodError } from "zod";
import { envSchema } from "../config/schemas";

const {data: cleanedEnv,error} = envSchema.safeParse(process.env);
if(error){
    throw error;
}
export default cleanedEnv;