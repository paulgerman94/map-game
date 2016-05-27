import ServerCore from "./ServerCore";
import { log } from "./util";
export class Server extends ServerCore {
	constructor(options) {
		super(options);
	}
	async onConnected(client) {
		log(`Let's ask the client to multiply "1 · 2 · 3".`);
		const [reply] = await client.multiply(1, 2, 3);
		log(`"1 · 2 · 3 = ${reply}".`);
	}
}
export default Server;