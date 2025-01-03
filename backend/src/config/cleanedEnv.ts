import { envSchema } from "./schemas";

const { data: cleanedEnv, error } = envSchema.safeParse(process.env);
if (error) {
	throw error;
}
export default cleanedEnv;

