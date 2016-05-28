import WS from "ws-promise-server";
import { log, err } from "./util";
import * as API from "./api/index";
/**
* This class is the protocol part that the server uses to communicate with.
* Deep inside, it extends `ws-promise-server` and is thus a fully-fledged RPCClient.
* This means that it can remotely invoke functions on other RPCClients that run in the browser.
*/
export default class ServerCore extends WS {
	/**
	* Constructs a new {@link ServerCore} instance
	* @param {object} options
	* 	A configuration object that is passed on to the constructor of `ws-promise-server`
	* @return {ServerCore}
	* 	An instance of {@link ServerCore}
	*/
	constructor(options) {
		super(options);
		log(`Server started on port "${options.port}".`);
	}
	/**
	* This method will fire whenever a new RPCClient connects to the server.
	* It will then create a proxy and emit a `connected` event that derived classes can use.
	* This enables the derived class (@see {@link Server}) to invoke functions that aren't defined here (basic RPC).
	* @param {RPCClient} socket
	* 	The RPCClient instance that has connected to the server
	* @return {undefined}
	*/
	onConnection(socket) {
		log("A client has connected.");
		const client = new Proxy(socket, {
			get: (target, property) => {
				const lookUp = target[property];
				if (!lookUp) {
					return async (...args) => {
						const returnValue = await target.send(property, undefined, ...args);
						if (returnValue && returnValue.error) {
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
		this.emit("connected", client);
		socket.on("close", () => {
			log("A client has disconnected.");
		});
		socket.on("message", msg => {
			const message = socket.readMessage(msg.data);
			const { payload } = message;
			const { instruction, args } = payload;
			/* If the server knows the instruction, run it */
			if (API[instruction]) {
				API[instruction]({
					args,
					message,
					client: socket
				});
			}
		});
	}
	/**
	* This method will fire whenver an error event occurs.
	* Currently, it is only used for logging purposes.
	* @param {Error} error
	* 	The error that occurred
	* @return {undefined}
	*/
	onError(error) {
		err(error);
	}
}