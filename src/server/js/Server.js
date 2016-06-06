import ServerCore from "./ServerCore";
/**
* This class includes the main API that clients will communicate with.
* It's responsible for game-related actions as well as answering client requests.
*/
export class Server extends ServerCore {
	/**
	* Creates a new {@link Server} instance.
	* @param {object} database
	* 	The PostgreSQL pg-promise database instance
	* @param {object} options
	* 	A configuration object that is passed to {@link ServerCore}
	*/
	constructor(database, options) {
		super(database, options);
	}
	/**
	* This method is fired when a new client connects to the server.
	* @param {RPCClient} client
	* 	An RPCClient that proxies function invocations via ES2015 `Promise`s to the browser
	*/
	async onConnected() {
		/* Do nothing if a client is connected (arguments: `client`) */
	}
}
export default Server;