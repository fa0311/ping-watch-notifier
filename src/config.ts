import z from "zod";
import "dotenv/config";

const addresses = ["1.1.1.1", "8.8.8.8", "9.9.9.9", "208.67.222.222", "1.0.0.1", "8.8.4.4"];

const configSchema = z.object({
	CHECK_INTERVAL: z.coerce.number().default(1000 * 60),
	RETRY_INTERVAL: z.coerce.number().default(1000 * 20),
	TIMEOUT: z.coerce.number().default(1),
	ADDRESSES: z
		.string()
		.transform((e) => e.split(",").map((s) => s.trim()))
		.default(addresses),
	ADDRESSES_TO_CHECK: z.coerce.number().default(2),
	LINE_NOTIFY_URL: z.string().default("https://notify-api.line.me/api/notify"),
	LINE_NOTIFY_TOKEN: z.string(),
	SEND_MESSAGE: z.string().default("network connection is restored after {hour} hours and {minute} minutes."),
});

export const parseConfig = () => configSchema.parse(process.env);
