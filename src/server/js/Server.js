import WS from "ws-promise-server";
import { log, err } from "./util";
import * as API from "./api/index";
export default class Server extends WS {
	constructor(options) {
		super(options);
		log(`Server started on port "${options.port}".`);
	}
	onConnection(socket) {
		log("A client has connected.");
		socket.on("close", socket => {
			log("A client has disconnected.");
		});
		socket.on("message", async message => {
			const content = message.body;
			if (!content.command || !content.args) {
				throw new Error("Malformed JSON message received");
			}
			else {
				const arg = {
					args: content.args,
					message: {
						reply: message.reply
					},
					client: this
				};
				if (API[content.command]) {
					await API[content.command](arg);
				}
				else {
					log(`Message type not implemented: "${content.command}"`);
				}
				this.emit(content.command, content.body);
			}
		});
	}
	onError(error) {
		err(error);
	}
};