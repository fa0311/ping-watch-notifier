import { parseConfig } from "./config.js";
import { createFormatMessage, createLineNotify, createPing, createTimer, shuffle } from "./utils.js";

const config = parseConfig();
const ping = createPing(config.TIMEOUT);
const line = createLineNotify({ token: config.LINE_NOTIFY_TOKEN, url: config.LINE_NOTIFY_URL });
const formatMessage = createFormatMessage(config.SEND_MESSAGE);

while (true) {
	const target = shuffle(config.ADDRESSES).slice(0, config.ADDRESSES_TO_CHECK);
	const start = createTimer();
	if (!(await ping.isConnected(target))) {
		do {
			await new Promise((resolve) => setTimeout(resolve, config.RETRY_INTERVAL));
			console.log(`Retrying... (${start.end()} ms)`);
		} while (!(await ping.isConnected(target)));
		const elapsed = start.end();
		await line.send(formatMessage.format(elapsed));
	}
	await new Promise((resolve) => setTimeout(resolve, config.CHECK_INTERVAL));
}
