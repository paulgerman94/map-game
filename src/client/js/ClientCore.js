import WS from "ws-promise-client";
export class Client extends WS {
	constructor() {
		const isEncrypted = location.protocol === "https:";
		super(`ws${isEncrypted ? "s" : ""}://${location.host}/socket/<%LINUX_USERNAME%>`);
	}
	onOpen() {
		console.log("Connection established.");
	}
	onMessage(msg) {
		const message = this.rpcClient.readMessage(msg.data);
		const { payload } = message;
		this.emit(payload.instruction, message, ...payload.args);
	}
}
export default Client;