import crypto from "crypto";

const algorithm = "aes-256-gcm"; // Changed from aes-256-ccm
// Use a stable 32-byte key in hex format:
const key = Buffer.from(
	"23f5b58f8c63447888dfb60dee7e162f834be1ec3ec6144337332bbf31b25c68",
	"hex"
);
const ivLength = 12; // For AES-256-GCM, the IV length is typically 12 bytes

// Encrypt data
export function encryptData(data: string): string {
	const iv = crypto.randomBytes(ivLength);
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	const encrypted = Buffer.concat([
		cipher.update(data, "utf8"),
		cipher.final(),
	]);
	const authTag = cipher.getAuthTag();

	return (
		iv.toString("hex") +
		":" +
		encrypted.toString("hex") +
		":" +
		authTag.toString("hex")
	);
}

// Decrypt data
export function decryptData(encryptedData: string): string {
	const parts = encryptedData.split(":");
	if (parts.length !== 3) {
		throw new Error("Invalid encrypted data format");
	}

	const iv = Buffer.from(parts[0], "hex");
	const encryptedText = Buffer.from(parts[1], "hex");
	const authTag = Buffer.from(parts[2], "hex");

	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([
		decipher.update(encryptedText),
		decipher.final(),
	]);

	return decrypted.toString("utf8");
}

