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
	/**
	* @param {Message} message
	* 	A message object that can be used to send a reply
	* @param {...*} args
	* 	The arguments that are passed by the caller
	*/
	onMultiply(message, ...args) {
		const product = args.reduce((a, b) => a * b, 1);
		message.reply(product);
	}
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