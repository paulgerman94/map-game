import WS from "ws-promise-client";
import { s } from "server/units";
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
			rpcOptions: {
				timeout: 20 * s
			}
		});
	}
	/**
	* This method fires whenever the connection is (re-)established.
	* Currently, it's only used for debugging purposes.
	*/
	onOpen() {
		console.log("Connection established.");
	}
	/**
	* This message fires whenever a new message arrives over the protocol.
	* The function will then read the message and fire a specialized event, depending on the payload instruction.
	* The event will be fired using the arguments that the other party has provided in the function invocation.
	* For example, if the instruction was `register` and the data was `"username", "password"`, this method will fire an event `onRegister` providing the parameters `"username", "password"`.
	* @param {MessageEvent} msg
	* 	The raw message event that was received over the WebSocket
	*/
	onMessage(msg) {
		const message = this.rpcClient.readMessage(msg.data);
		const { payload } = message;
		this.emit(payload.instruction, message, ...payload.args);
	}
}
export default ClientCore;