import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import cache from "client/cache";
/**
* A symbol that denotes that the game camera's follow mode has been configured
*/
export const CAMERA_FOLLOW_CONFIGURED = Symbol("Camera follow configured");
/**
* A symbol that denotes that the game notifications have been configured
*/
export const NOTIFICATION_CONFIGURED = Symbol("Notification configured");
/**
* A symbol that denotes that the browser registers that the notification permission has been granted
*/
export const NOTIFICATION_GRANTED = Symbol("Notification granted");
/**
* A symbol that denotes that the browser tries to request the user's permission to send Notifications
*/
export const NOTIFICATION_REQUESTED = Symbol("Notification requested");
/**
* This class is a flux store that keeps a global view of the game settings.
*/
class SettingsStore extends EventEmitter {
	isCameraFollowing = cache.has("isCameraFollowing") ? cache.load("isCameraFollowing") : true;
	isNotificationAllowed = cache.has("isNotificationAllowed") ? cache.load("isNotificationAllowed") : null;
	/**
	* Creates a new {@link SettingsStore}
	*/
	constructor() {
		super();
		(async () => {
			const notificationPermission = await navigator.permissions.query({
				name: "notifications"
			});
			if (notificationPermission.state !== "granted") {
				this.isNotificationAllowed = false;
				this.emit(NOTIFICATION_CONFIGURED, {
					isNotificationAllowed: this.isNotificationAllowed
				});
				cache.save("isNotificationAllowed", this.isNotificationAllowed);
			}
		})();
	}
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		switch (action.type) {
			case CAMERA_FOLLOW_CONFIGURED: {
				this.isCameraFollowing = action.isCameraFollowing;
				this.emit(action.type, action.isCameraFollowing);
				cache.save("isCameraFollowing", action.isCameraFollowing);
				break;
			}
			case NOTIFICATION_CONFIGURED: {
				this.isNotificationAllowed = action.isNotificationAllowed;
				this.emit(action.type, action.isNotificationAllowed);
				cache.save("isNotificationAllowed", action.isNotificationAllowed);
				break;
			}
			case NOTIFICATION_REQUESTED: {
				this.emit(action.type);
				break;
			}
			case NOTIFICATION_GRANTED: {
				this.emit(action.type);
				break;
			}
			default: {
				break;
			}
		}
	}
}
const settingsStore = new SettingsStore();
dispatcher.register(::settingsStore.handleActions);
export default settingsStore;