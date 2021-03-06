import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import cache from "client/cache";
/**
* A symbol that denotes that the game camera's follow mode has been configured
* @type {symbol}
*/
export const CAMERA_FOLLOW_CONFIGURED = Symbol("Camera follow configured");
/**
* This class is a flux store that keeps a global view of the game settings.
*/
class SettingsStore extends EventEmitter {
	/**
	* Creates a new {@link SettingsStore}
	*/
	constructor() {
		super();
		/**
		* Whether the camera should follow the player or not
		* @type {boolean}
		*/
		this.isCameraFollowing = cache.has("isCameraFollowing") ? cache.load("isCameraFollowing") : true;
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
			default: {
				break;
			}
		}
	}
}
const settingsStore = new SettingsStore();
dispatcher.register(::settingsStore.handleActions);
/**
* The {@link SettingsStore} singleton instance
*/
export default settingsStore;