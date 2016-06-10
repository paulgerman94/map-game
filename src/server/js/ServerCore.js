import WS from "ws-promise-server";
import { log, err } from "./util";
import { checkToken } from "./crypto";
import * as API from "./api/index";
const guestFunctions = {
	isFree: API.isFree,
	login: API.login,
	register: API.register
};
/**
* This class is the protocol part that the server uses to communicate with.
* Deep inside, it extends `ws-promise-server` and is thus a fully-fledged RPCClient.
* This means that it can remotely invoke functions on other RPCClients that run in the browser.
*/
export default class ServerCore extends WS {
	/**
	* Constructs a new {@link ServerCore} instance
	* @param {object} database
	* 	The PostgreSQL pg-promise database instance
	* @param {object} options
	* 	A configuration object that is passed on to the constructor of `ws-promise-server`
	*/
	constructor(database, options) {
		super(options);
		/**
		* @property {object} db
		* 	The PostgreSQL pg-promise database instance
		*/
		this.db = database;
		log(`Server started on port "${options.port}".`);
	}
	/**
	* Handles a client request if the server knows the instruction
	* @param {object} options
	* 	An object that contains the options listed below
	* @param {Array} options.args
	* 	The arguments provided by the caller
	* @param {string} options.instruction
	* 	The instruction to execute
	* @param {Message} options.message
	* 	An RPC message object that can be used to send a reply
	* @param {RPCClient} options.socket
	* 	The RPC client that has called the function
	*/
	handleRequest({
		args,
		instruction,
		message,
		socket
	}) {
		if (API[instruction]) {
			API[instruction]({
				args,
				db: this.db,
				client: socket,
				message
			});
		}
	}
	/**
	* This method will fire whenever a new RPCClient connects to the server.
	* It will then create a proxy and emit a `connected` event that derived classes can use.
	* This enables the derived class (see {@link Server}) to invoke functions that aren't defined here (basic RPC).
	* @param {RPCClient} socket
	* 	The RPCClient instance that has connected to the server
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
		socket.on("message", async msg => {
			const message = socket.readMessage(msg.data);
			const { payload } = message;
			const { instruction, args } = payload;
			const [metadata] = args;
			const { token } = metadata;
			/* If there is a token… */
			if (token) {
				/* …check if it is valid. */
				const isValid = await checkToken(token);
				if (isValid) {
					if (instruction === "login") {
						message.reply(token);
					}
					else {
						/* If this is not a `login` instruction, run it */
						this.handleRequest({
							args,
							instruction,
							message,
							socket
						});
					}
				}
				else {
					message.reply(false);
				}
			}
			else {
				/* If there is no token, limit the executable functions */
				if (guestFunctions[instruction]) {
					this.handleRequest({
						args,
						instruction,
						message,
						socket
					});
				}
				else {
					message.reply(false);
				}
			}
		});
	}
	/**
	* This method will fire whenver an error event occurs.
	* Currently, it is only used for logging purposes.
	* @param {Error} error
	* 	The error that occurred
	*/
	onError(error) {
		err(error);
	}
}