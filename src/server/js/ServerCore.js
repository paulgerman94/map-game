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
			if (API[instruction]) {
				return await API[instruction]({
					args,
					message,
					client: socket
				});
			}
		});
	}
	onError(error) {
		err(error);
	}
}