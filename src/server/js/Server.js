import ServerCore from "./ServerCore";
import { log } from "./util";
/**
* This class includes the main API that clients will communicate with.
* It's responsible for game-related actions as well as answering client requests.
*/
export class Server extends ServerCore {
	/**
	* Creates a new {@link Server} instance.
	* @param {object} options
	* 	A configuration object that is passed to {@link ServerCore}
	*/
	constructor(options) {
		super(options);
	}
	/**
	* This method is fired when a new client connects to the server.
	* @param {RPCClient} client
	* 	An RPCClient that proxies function invocations via ES2015 `Promise`s to the browser
	*/
	async onConnected(client) {
		log(`Let's ask the client to multiply "1 · 2 · 3".`);
		const [reply] = await client.multiply(1, 2, 3);
		log(`"1 · 2 · 3 = ${reply}".`);
	}
}
export default Server;