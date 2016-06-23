import ServerCore from "./ServerCore";
import { getArea } from "./db";
import { s } from "./units";
import GCM from "node-gcm";
import { err, log } from "./util";
const notifier = new GCM.Sender(process.env.GCM_KEY);
/**
* This class includes the main API that clients will communicate with.
* It's responsible for game-related actions as well as answering client requests.
*/
export class Server extends ServerCore {
	clients = new Set();
	/**
	* Creates a new {@link Server} instance
	* @param {object} database
	* 	The PostgreSQL pg-promise database instance
	* @param {object} options
	* 	A configuration object that is passed to {@link ServerCore}
	*/
	constructor(database, options) {
		super(database, options);
		// setInterval(::this.broadcastArea, 5 * s);
		setInterval(() => {
			this.pushNotification(this.clients, "hi");
		}, 5 * s);
	}
	/**
	* Sends a push notification to a client
	* @param {Array|Set} clients
	* 	The clients to send the notification to
	* @param {string} text
	* 	The text to include in the message
	*/
	pushNotification(clients, text) {
		const registrationTokens = Array.from(clients)
			.filter(client => client.properties.notificationID)
			.map(client => {
				return client.properties.notificationID;
			});
		if (registrationTokens.length) {
			const message = new GCM.Message({
				data: {
					text
				}
			});
			notifier.send(message, {
				registrationTokens
			}, (error, response) => {
				if (error) {
					err(error);
					log(response);
				}
			});
		}
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
export default Server;