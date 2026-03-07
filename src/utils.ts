import ping from "ping";

export const createPing = (timeout: number) => {
	return {
		isConnected: async (addresses: string[]) => {
			for (const ip of addresses) {
				const res = await ping.promise.probe(ip, { timeout });
				if (res.alive) {
					console.log(`Host ${ip} is alive, time: ${res.time} ms`);
					return true;
				} else {
					console.log(`Host ${ip} is not alive`);
				}
			}
		},
	};
};

export const createTimer = () => {
	const now = new Date();
	return {
		end: () => Date.now() - now.getTime(),
	};
};

export const createLineNotify = (config: { token: string; url: string }) => {
	return {
		send: async (message: string) => {
			const response = await fetch(config.url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Bearer ${config.token}`,
				},
				body: new URLSearchParams({ message }),
			});
			if (!response.ok) {
				console.error("Failed to send Line Notify:", response.statusText);
			} else {
				console.log("Line Notify sent successfully");
			}
		},
	};
};

export const createFormatMessage = (text: string) => {
	return {
		format: (elapsed: number) => {
			const hours = Math.floor(elapsed / (1000 * 60 * 60));
			const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
			return text.replace("{hour}", `${hours}`).replace("{minute}", `${minutes}`).replace("{second}", `${seconds}`);
		},
	};
};

export const shuffle = <T>(array: T[]) => array.toSorted(() => Math.random() - 0.5);
