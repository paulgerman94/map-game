import WS from "ws-promise-client";
import ClientCore from "./ClientCore";
class Client extends ClientCore {
	onMultiply(message, ...args) {
		const product = args.reduce((a, b) => a * b, 1);
		message.reply(product);
	}
};
export default new Proxy(new Client(), {
	get: (target, property) => {
		const lookUp = target[property];
		if (!lookUp) {
			return async (...args) => {
				const returnValue = await target.send(property, undefined, ...args);
				if (!returnValue || returnValue && returnValue.error) {
					throw new Error(`Error trying to proxy ${property} with arguments`, args);
				}
				return returnValue.payload.args;
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