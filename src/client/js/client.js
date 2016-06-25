import ClientCore from "./ClientCore";
import ConnectionStore from "./ui/stores/ConnectionStore";
import SplashScreen from "./ui/SplashScreen";
import { s } from "server/units";
import {
	default as PermissionStore,
	NOTIFICATIONS,
	GRANTED,
	ENABLED
} from "./ui/stores/PermissionStore";
import * as API from "./api/index";
import {
	default as cache,
	TOKEN
} from "./cache";
const timeouts = {
	getPOIs: 10 * s
};
/**
* This is a client implementation that can communicate with the server.
* The client defines event handlers for RPC methods that the server sends and methods to query the server.
*/
class Client extends ClientCore {
	/**
	* This method fires whenever the connection is (re-)established.
	* It will perform tasks that are necessary after a successful connection establishment (i. e. updating the notification ID).
	*/
	async onOpen() {
		console.log("Connection established.");
		try {
			/* Try to log in via the session token */
			await API.login();
			this.sendNotificationID();
		}
		catch (e) {
			/* We couldn't log in via the token mechanism */
		}
		finally {
			/* Now that we know whether or not the login succeeded, remove the splash screen */
			SplashScreen.hide();
		}
	}
	/**
	* Asynchronously updates the notification ID for the client on the server
	*/
	async sendNotificationID() {
		const notifications = PermissionStore.get(NOTIFICATIONS);
		if (notifications.permission === GRANTED && notifications.preference === ENABLED) {
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
				const message = await target.send({
					args,
					instruction: property,
					timeout: timeouts[property]
				});
				const [firstValue] = message.payload.args;
				if (!firstValue || firstValue && firstValue.error) {
					throw new Error(`Error trying to proxy ${property} with arguments:`, args);
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