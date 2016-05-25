import WS from "ws-promise-client";
class Client extends WS {
	constructor() {
		const isEncrypted = location.protocol === "https:";
		super(`ws${isEncrypted ? "s" : ""}://${location.host}/socket/<%LINUX_USERNAME%>`);
	}
	onOpen() {
		console.log("Connection established.");
	}
};
export default new Proxy(new Client(), {
	get: (target, property) => {
		const lookUp = target[property];
		if (!lookUp) {
			return async (...args) => {
				const returnValue = await target.send({
					command: property,
					args
				});
				if (returnValue.error) {
					throw new Error(`Error trying to proxy ${property} with arguments`, args);
				}
				return returnValue;
			};
		}
		else {
			if (lookUp instanceof Function) {
				return target::lookUp;
			}
			else {
				return lookUp;
			}
		}
	}
});