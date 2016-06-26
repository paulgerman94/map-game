import WS from "ws-promise-client";
import { s } from "server/units";
import {
	default as cache,
	TOKEN
} from "./cache";
/**
* This base class is the protocol part of the client.
* It is derived in {@link Client} and is supposed to connect to other `RPCClient`s.
*/
export class ClientCore extends WS {
	/**
	* Constructs a new ClientCore instance
	* This will connect to a separate WebSocket for every developer, depending on the Linux username.
	* It will also automatically resolve whether it's supposed to use an encrypted connection or not.
	*/
	constructor() {
		const isEncrypted = location.protocol === "https:";
		super(`ws${isEncrypted ? "s" : ""}://${location.host}/socket/<%LINUX_USERNAME%>`, undefined, {
			reconnectionMinimum: s,
			reconnectionFactor: 1.0,
			rpcOptions: {
				timeout: s
			}
		});
	}
	/**
	* This message fires whenever a new message arrives over the protocol.
	* The function will then read the message and fire a specialized event, depending on the payload instruction.
	* The event will be fired using the arguments that the other party has provided in the function invocation.
	* For example, if the instruction was `register` and the data was `"username", "password"`, this method will fire an event `onRegister` providing the parameters `"username", "password"`.
	* @param {MessageEvent} message
	* 	The specialized message event that was received over the RPCClient
	*/
	onMessage(message) {
		const reply = message.reply;
		/* Fire a specialized event with a dynamically adjusted reply function */
		message.reply = (...args) => {
			args.unshift({
				token: cache.load(TOKEN)
			});
			reply(args);
		};
	}
}
export default ClientCore;