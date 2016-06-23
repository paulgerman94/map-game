import ClientCore from "./ClientCore";
import ConnectionStore from "./ui/stores/ConnectionStore";
import SettingsStore from "./ui/stores/SettingsStore";
import * as API from "./api/index";
import {
	default as cache,
	TOKEN
} from "./cache";
/**
* This is a client implementation that can communicate with the server.
* The client defines event handlers for RPC methods that the server sends and methods to query the server.
*/
class Client extends ClientCore {
	/**
	* This method fires whenever the connection is (re-)established.
	* It will perform tasks that are necessary after a successful connection establishment (i. e. updating the notification ID).
	*/
	onOpen() {
		console.log("Connection established.");
		this.sendNotificationID();
	}
	/**
	* Asynchronously updates the notification ID for the client on the server
	*/
	async sendNotificationID() {
		if (SettingsStore.isNotificationAllowed === true) {
			const registration = ConnectionStore.serviceWorkerRegistration;
			const subscription = await registration.pushManager.getSubscription();
			API.updateNotificationID(subscription);
		}
	}
}
export default new Proxy(new Client(), {
	get: (target, property) => {
		const lookUp = target[property];
		if (!lookUp) {
			return async (...args) => {
				args.unshift({
					token: cache.load(TOKEN)
				});
				const message = await target.send(property, undefined, ...args);
				const [firstValue] = message.payload.args;
				if (!firstValue || firstValue && firstValue.error) {
					throw new Error(`Error trying to proxy ${property} with arguments`, args);
				}
				return message.payload.args;
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