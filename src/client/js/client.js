import ClientCore from "./ClientCore";
import {
	default as cache,
	TOKEN
} from "./cache";
/**
* This is a client implementation that can communicate with the server.
* The client defines event handlers for RPC methods that the server sends and methods to query the server.
*/
class Client extends ClientCore {
	/* Add on[instruction] events here */
}
export default new Proxy(new Client(), {
	get: (target, property) => {
		const lookUp = target[property];
		if (!lookUp) {
			return async (...args) => {
				args.unshift({
					token: cache.load(TOKEN)
				});
				const message = await target.send(property, undefined, ...args);
				const [firstValue] = message.payload.args;
				if (!firstValue || firstValue && firstValue.error) {
					throw new Error(`Error trying to proxy ${property} with arguments`, args);
				}
				return message.payload.args;
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