import ClientCore from "./ClientCore";
import {
	ConnectionStore,
	SCORE_UPDATED
} from "./ui/stores/ConnectionStore";
import SplashScreen from "./ui/SplashScreen";
import { s } from "server/units";
import {
	default as LocationStore,
	FLAG_CACHE_UPDATED
} from "./ui/stores/LocationStore";
import {
	default as PermissionStore,
	NOTIFICATIONS,
	GRANTED,
	ENABLED
} from "./ui/stores/PermissionStore";
import * as API from "./api/index";
import { publish } from "./ui/Dispatcher";
import {
	default as cache,
	TOKEN
} from "./cache";
const timeouts = {
	getPOIs: 25 * s
};
/**
* This is a client implementation that can communicate with the server.
* The client defines event handlers for RPC methods that the server sends and methods to query the server.
*/
class Client extends ClientCore {
	/**
	* This method fires whenever the connection is (re-)established.
	* It will perform tasks that are necessary after a successful connection establishment (i.e. updating the notification ID).
	*/
	async onOpen() {
		console.debug("Connection established.");
		try {
			/* Try to log in via the session token */
			await API.login();
			await API.getUserInformation(ConnectionStore.user.accountName);
			this.sendSubscription();
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
	* Updates the LocationStore whenever the server broadcasts a `drawArea` event
	* @param {Message} message
	* 	The message that was sent over the {@link RPCClient}
	*/
	onDrawArea(message) {
		message.reply();
		const { payload } = message;
		const [centers] = payload.args;
		LocationStore.updateArea(centers);
	}
	/**
	* Updates the flag information once the player is messaged that a nearby flag has been captured, if available
	* @param {Message} message
	* 	The message that was sent over the {@link RPCClient} containing the new flag information
	*/
	onRegisterCapture(message) {
		message.reply();
		const { payload } = message;
		const [capture] = payload.args;
		const { id, newFlagInfo } = capture;
		const { capturedAt, lockedUntil, owner, team } = newFlagInfo;
		const capturedDate = new Date(capturedAt);
		const lockedDate = new Date(lockedUntil);
		publish(FLAG_CACHE_UPDATED, {
			flags: [{
				id,
				owner,
				team,
				capturedAt: capturedDate,
				lockedUntil: lockedDate
			}]
		});
	}
	/**
	* Updates the player's score
	* @param {Message} message
	* 	The message that was sent over the {@link RPCClient} containing the new flag information
	*/
	onUpdateScore(message) {
		message.reply();
		const { payload } = message;
		const [data] = payload.args;
		const { score } = data;
		publish(SCORE_UPDATED, {
			score
		});
	}
	/**
	* Asynchronously updates the notification ID for the client on the server
	*/
	async sendSubscription() {
		const notifications = PermissionStore.get(NOTIFICATIONS);
		if (notifications.permission === GRANTED && notifications.preference === ENABLED) {
			const registration = ConnectionStore.serviceWorkerRegistration;
			let subscription = await registration.pushManager.getSubscription();
			/* The subscription may be `null`, especially with regards to cache */
			if (!subscription) {
				subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true
				});
			}
			API.updateSubscription(subscription);
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
