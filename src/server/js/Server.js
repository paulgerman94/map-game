import ServerCore from "./ServerCore";
import { getArea } from "./db";
// import { s } from "./units";
import PushNotifier from "./PushNotifier";
/**
* This class includes the main API that clients will communicate with.
* It's responsible for game-related actions as well as answering client requests.
*/
export default class Server extends ServerCore {
	/**
	* Creates a new {@link Server} instance
	* @param {object} database
	* 	The PostgreSQL pg-promise database instance
	* @param {object} options
	* 	A configuration object that is passed to {@link ServerCore}
	*/
	constructor(database, options) {
		super(database, options);
		/**
		* The notifier that the server uses to access the Push API
		* @type {PushNotifier}
		*/
		this.notifier = new PushNotifier(this);
		/**
		* A list of clients that the server can use to see who's connected
		* @type {Array.<RPCClient>}
		*/
		this.clients = new Set();
		// setInterval(::this.broadcastArea, 5 * s);
	}
	/**
	* This method is fired when a new client connects to the server.
	* @param {RPCClient} client
	* 	An RPCClient that proxies function invocations via ES2015 `Promise`s to the browser
	*/
	async onConnected(client) {
		this.clients.add(client);
	}
	/**
	* This method is fired when a new client disconnects from the server.
	* @param {RPCClient} client
	* 	An RPCClient that proxies function invocations via ES2015 `Promise`s to the browser
	*/
	async onDisconnected(client) {
		this.clients.delete(client);
	}
	/**
	* This method broadcasts the known area to all players.
	*/
	async broadcastArea() {
		const area = await getArea({
			db: this.db
		});
		this.broadcast(client => {
			client.drawArea(area);
		});
	}
	/**
	* This method calls a custom function on all player clients.
	* @param {function} fn
	* 	A function that will be invoked with the RPCClient being its first parameter
	*/
	async broadcast(fn) {
		for (const client of this.clients) {
			fn(client);
		}
	}
}