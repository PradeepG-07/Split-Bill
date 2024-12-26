import crypto from "crypto";
import cleanedEnv from "../config/cleanedEnv";

// Generate secret hash with crypto to use for encryption
const key = crypto
	.createHash("sha512")
	.update(cleanedEnv!.ACCESS_TOKEN_SECRET)
	.digest("hex")
	.substring(0, 32);

// Encrypt data
export function encryptData(data: string) {
	const iv = crypto.randomBytes(12); // Generate a new IV for each encryption
	const cipher = crypto.createCipheriv("aes-256-ccm", key, iv, {
		authTagLength: 16,
	});
	const encrypted = Buffer.concat([
		cipher.update(data, "utf8"),
		cipher.final(),
	]);
	return iv.toString("hex") + ":" + encrypted.toString("hex"); // Prepend IV to encrypted data
}

// Decrypt data
export function decryptData(encryptedData: string) {
	const parts = encryptedData.split(":");
	const iv = Buffer.from(parts.shift()!, "hex"); // Extract IV from encrypted data
	const encryptedText = Buffer.from(parts.join(":"), "hex");
	const decipher = crypto.createDecipheriv("aes-256-ccm", key, iv, {
		authTagLength: 16,
	});
	const decrypted = Buffer.concat([
		decipher.update(encryptedText),
		decipher.final(),
	]);
	return decrypted.toString("utf8"); // Decrypts data and converts to utf8
}

